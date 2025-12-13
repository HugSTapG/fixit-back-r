import {
    Injectable,
    Logger,
    BadRequestException,
    NotFoundException,
    Inject,
    OnModuleInit,
    OnModuleDestroy,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { OllamaClient, ChatMessage, LLMResponse } from './ollama-client';
import {
    ChatSession,
    LLMJSONResponse,
    CreateSolicitudData,
    MAESTRITO_SYSTEM_PROMPT,
    REQUIRED_FIELDS,
    MaestritoResponse,
} from './types/chat-session.types';
import { REQUEST_PATTERNS } from '@app/events';

/**
 * Servicio del módulo Maestrito
 * Orquesta conversaciones de chat con LLM y crea solicitudes
 */
@Injectable()
export class MaestritoService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(MaestritoService.name);
    private sessions = new Map<string, ChatSession>();
    private readonly SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutos
    private cleanupInterval: NodeJS.Timeout;
    private ollamaModel = 'llama2'; // Modelo por defecto, se puede cambiar

    constructor(
        private readonly ollamaClient: OllamaClient,
        @Inject('REQUEST_SERVICE') private readonly requestClient: ClientProxy,
    ) {}

    /**
     * Inicializa el servicio: limpieza periódica de sesiones y health check
     */
    async onModuleInit() {
        this.logger.log('Maestrito Service initialized');

        // Verificar conectividad con Ollama
        const isHealthy = await this.ollamaClient.healthCheck();
        if (!isHealthy) {
            this.logger.warn('Ollama is not responding. Check if it is running.');
        } else {
            this.logger.log('Ollama is healthy');
        }

        // Obtener modelos disponibles
        const models = await this.ollamaClient.getAvailableModels();
        this.logger.log(`Available Ollama models: ${models.join(', ')}`);

        // Limpiar sesiones expiradas cada 5 minutos
        this.cleanupInterval = setInterval(() => {
            this.cleanupExpiredSessions();
        }, 5 * 60 * 1000);
    }

    /**
     * Limpia recursos al destruir el servicio
     */
    onModuleDestroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }

    /**
     * Inicia una nueva sesión de chat
     *
     * @param userId ID del usuario que inicia la sesión
     * @returns ID de la sesión
     */
    startSession(userId: number): { sessionId: string } {
        const sessionId = uuidv4();

        const session: ChatSession = {
            sessionId,
            userId,
            createdAt: new Date(),
            lastActivityAt: new Date(),
            messages: [
                {
                    role: 'system',
                    content: MAESTRITO_SYSTEM_PROMPT,
                },
            ],
            isActive: true,
            partialSolicitudData: {},
            failedAttempts: 0,
            awaitingConfirmation: false,
            pendingSolicitudData: null,
            lastSummaryMessage: null,
            pendingField: 'SERVICE_TYPE',
            completedFields: [],
            skippedOptionalFields: [],
            lastUserWasUncertain: false,
        };

        this.sessions.set(sessionId, session);
        this.logger.log(`Session started: ${sessionId} for user: ${userId}`);

        return { sessionId };
    }

    /**
     * Envía un mensaje en una sesión activa
     *
     * @param sessionId ID de la sesión
     * @param userMessage Mensaje del usuario
     * @returns Respuesta de Maestrito
     */
    async sendMessage(sessionId: string, userMessage: string): Promise<MaestritoResponse> {
        const session = this.getSession(sessionId);

        // Validar que el mensaje no esté vacío
        if (!userMessage || userMessage.trim().length === 0) {
            throw new BadRequestException('El mensaje no puede estar vacío');
        }

        try {
            // Agregar mensaje del usuario al historial
            session.messages.push({
                role: 'user',
                content: userMessage,
            });

            // Construir historial para Ollama: system prompt + últimos 10 mensajes user/assistant
            const messagesToSend = this.buildMessagesForOllama(session);

            // Llamar a Ollama
            const ollamaResponse = await this.ollamaClient.chat(
                this.ollamaModel,
                messagesToSend,
            );

            // Parsear respuesta
            const llmResponse = this.parseLLMResponse(ollamaResponse);

            // Agregar respuesta del asistente al historial (el JSON parseado, no el raw)
            session.messages.push({
                role: 'assistant',
                content: ollamaResponse,
            });

            session.lastActivityAt = new Date();

            // Si el modelo quiere crear una solicitud
            if (llmResponse.mode === 'CREAR_SOLICITUD') {
                return this.handleCreateSolicitud(session, llmResponse);
            }

            // Caso normal: solo mensaje
            return {
                sessionId,
                type: 'MESSAGE',
                message: llmResponse.content,
                timestamp: new Date(),
            };
        } catch (error) {
            this.logger.error(`Error in sendMessage: ${error.message}`);

            return {
                sessionId,
                type: 'ERROR',
                message: `Error: ${error.message}`,
                timestamp: new Date(),
            };
        }
    }

    /**
     * Maneja la creación de una solicitud cuando el LLM lo indica
     *
     * @param session Sesión actual
     * @param llmResponse Respuesta del LLM con datos
     * @returns Respuesta indicando éxito o error
     */
    private async handleCreateSolicitud(
        session: ChatSession,
        llmResponse: LLMJSONResponse,
    ): Promise<MaestritoResponse> {
        try {
            // Validar que tenemos todos los campos requeridos
            const missingFields = this.validateRequiredFields(llmResponse.solicitudData);
            if (missingFields.length > 0) {
                this.logger.warn(
                    `Missing required fields: ${missingFields.join(', ')}`,
                );

                // Instruir al LLM a pedir estos campos (como mensaje system, no assistant)
                const clarificationMessage = `Faltan campos requeridos: ${missingFields.join(', ')}. Por favor solicita estos datos al usuario.`;
                session.messages.push({
                    role: 'system',
                    content: clarificationMessage,
                });

                session.failedAttempts++;

                if (session.failedAttempts > 3) {
                    return {
                        sessionId: session.sessionId,
                        type: 'ERROR',
                        message:
                            'No se pudieron recopilar los datos necesarios. Inicia una nueva sesión.',
                        timestamp: new Date(),
                    };
                }

                return {
                    sessionId: session.sessionId,
                    type: 'WAITING_INPUT',
                    message: clarificationMessage,
                    missingFields,
                    timestamp: new Date(),
                };
            }

            // Mapear datos a CreateSolicitudDto
            const createSolicitudDto = this.mapToCreateSolicitudDto(
                llmResponse.solicitudData as CreateSolicitudData,
            );

            // Llamar al servicio request para crear la solicitud
            const response = await firstValueFrom(
                this.requestClient.send(REQUEST_PATTERNS.CREATE_SOLICITUD, {
                    createSolicitudDto,
                    idUser: session.userId,
                }),
            );

            if (!response.success) {
                throw new BadRequestException(response.error);
            }

            // Marcar sesión como completada
            session.isActive = false;

            this.logger.log(
                `Solicitud creada vía Maestrito: ${response.data.idSolicitud}`,
            );

            return {
                sessionId: session.sessionId,
                type: 'SOLICITUD_CREATED',
                message: `¡Solicitud creada exitosamente! ID: ${response.data.idSolicitud}`,
                solicitud: response.data,
                timestamp: new Date(),
            };
        } catch (error) {
            this.logger.error(
                `Error creating solicitud via Maestrito: ${error.message}`,
            );

            session.failedAttempts++;

            return {
                sessionId: session.sessionId,
                type: 'ERROR',
                message: `Error al crear la solicitud: ${error.message}`,
                timestamp: new Date(),
            };
        }
    }

    /**
     * Construye el array de mensajes para enviar a Ollama
     * Incluye: system prompt + últimos 10 mensajes user/assistant
     * Esto optimiza el contexto y reduce tokens
     *
     * @param session Sesión actual
     * @returns Array de mensajes para Ollama
     */
    private buildMessagesForOllama(session: ChatSession): ChatMessage[] {
        const systemMessage = session.messages.find(m => m.role === 'system');
        const userAssistantMessages = session.messages.filter(m => m.role !== 'system');
        
        // Tomar solo los últimos 10 mensajes user/assistant
        const recentMessages = userAssistantMessages.slice(-10);
        
        // Reconstruir: system + últimos 10
        const messagesToSend: ChatMessage[] = [];
        
        if (systemMessage) {
            messagesToSend.push(systemMessage);
        }
        
        messagesToSend.push(...recentMessages);
        
        return messagesToSend;
    }

    /**
     * Parsea la respuesta de Ollama esperando JSON
     * Detiene code fences (```), busca el bloque JSON válido más grande
     *
     * @param response Respuesta de texto de Ollama
     * @returns Respuesta parseada
     */
    private parseLLMResponse(response: string): LLMJSONResponse {
        try {
            // Remover code fences (``` o ```json)
            let cleanedResponse = response
                .replace(/```json\s*/g, '')
                .replace(/```\s*/g, '')
                .trim();

            // Buscar TODOS los bloques JSON válidos y usar el más grande
            const jsonMatches = cleanedResponse.match(/\{[\s\S]*?\}/g) || [];
            
            let jsonStr: string | null = null;
            let longestJson = '';

            // Encontrar el JSON más largo (más completo)
            for (const match of jsonMatches) {
                if (match.length > longestJson.length) {
                    try {
                        JSON.parse(match);
                        longestJson = match;
                    } catch {
                        // JSON inválido, ignorar
                    }
                }
            }

            if (longestJson) {
                jsonStr = longestJson;
            }

            if (!jsonStr) {
                this.logger.warn(
                    `No valid JSON found in LLM response. Raw: ${cleanedResponse.substring(0, 100)}...`,
                );
                // Fallback: tratar como mensaje simple
                return {
                    mode: 'MENSAJE',
                    content: cleanedResponse,
                    confidence: 0.3,
                };
            }

            const parsed = JSON.parse(jsonStr);

            // Validar estructura mínima
            if (!parsed.mode || !parsed.content) {
                this.logger.warn(
                    `Invalid LLM JSON structure: missing mode or content. Got: ${JSON.stringify(parsed).substring(0, 100)}`,
                );
                throw new Error('Missing mode or content');
            }

            return {
                mode: parsed.mode as 'MENSAJE' | 'CREAR_SOLICITUD',
                content: parsed.content,
                solicitudData: parsed.solicitudData,
                confidence: parsed.confidence ?? 0.5,
            };
        } catch (error) {
            this.logger.warn(`Failed to parse LLM response as JSON: ${error.message}`);
            // Fallback: tratar como mensaje simple
            return {
                mode: 'MENSAJE',
                content: response,
                confidence: 0.3,
            };
        }
    }

    /**
     * Valida que todos los campos requeridos estén presentes
     *
     * @param data Datos a validar
     * @returns Array de campos faltantes
     */
    private validateRequiredFields(data?: Partial<CreateSolicitudData>): string[] {
        const missing: string[] = [];

        if (!data) {
            return REQUIRED_FIELDS.map(f => f as string);
        }

        for (const field of REQUIRED_FIELDS) {
            const value = data[field];
            if (value === null || value === undefined || value === '') {
                missing.push(field as string);
            }
        }

        return missing;
    }

    /**
     * Mapea datos del LLM a CreateSolicitudDto validado
     *
     * @param data Datos del LLM
     * @returns DTO para crear solicitud
     */
    private mapToCreateSolicitudDto(data: CreateSolicitudData): any {
        const dto: any = {
            idTipoServicio: parseInt(String(data.idTipoServicio), 10),
            codigoParroquia: String(data.codigoParroquia).trim(),
            tituloProblema: String(data.tituloProblema).trim(),
            descripcionProblema: String(data.descripcionProblema).trim(),
        };

        // Campos opcionales
        if (data.costoEstimado !== undefined && data.costoEstimado !== null) {
            dto.costoEstimado = parseFloat(String(data.costoEstimado));
        }

        if (data.costoPromocion !== undefined && data.costoPromocion !== null) {
            dto.costoPromocion = parseFloat(String(data.costoPromocion));
        }

        if (data.promocion !== undefined && data.promocion !== null) {
            dto.promocion = Boolean(data.promocion);
        }

        if (data.fechaProgramada) {
            // Validar que sea una fecha válida
            const date = new Date(data.fechaProgramada);
            if (!isNaN(date.getTime())) {
                dto.fechaProgramada = data.fechaProgramada;
            }
        }

        if (data.duracionEstimadaMin !== undefined && data.duracionEstimadaMin !== null) {
            dto.duracionEstimadaMin = parseInt(String(data.duracionEstimadaMin), 10);
        }

        return dto;
    }

    /**
     * Obtiene una sesión activa
     *
     * @param sessionId ID de la sesión
     * @returns Sesión
     */
    private getSession(sessionId: string): ChatSession {
        const session = this.sessions.get(sessionId);

        if (!session) {
            throw new NotFoundException(`Sesión ${sessionId} no encontrada`);
        }

        if (!session.isActive) {
            throw new BadRequestException('Esta sesión ya ha sido finalizada');
        }

        return session;
    }

    /**
     * Obtiene el historial de una sesión
     *
     * @param sessionId ID de la sesión
     * @returns Mensajes de la sesión
     */
    getSessionHistory(sessionId: string): ChatMessage[] {
        const session = this.getSession(sessionId);
        // No incluir el mensaje del sistema en la respuesta
        return session.messages.slice(1);
    }

    /**
     * Finaliza una sesión manualmente
     *
     * @param sessionId ID de la sesión
     */
    endSession(sessionId: string): void {
        const session = this.getSession(sessionId);
        session.isActive = false;
        this.logger.log(`Session ended: ${sessionId}`);
    }

    /**
     * Limpia sesiones expiradas
     */
    private cleanupExpiredSessions(): void {
        const now = Date.now();
        let deletedCount = 0;

        for (const [sessionId, session] of this.sessions.entries()) {
            const lastActivity = session.lastActivityAt.getTime();
            if (now - lastActivity > this.SESSION_TIMEOUT_MS) {
                this.sessions.delete(sessionId);
                deletedCount++;
            }
        }

        if (deletedCount > 0) {
            this.logger.log(`Cleaned up ${deletedCount} expired sessions`);
        }
    }
}
