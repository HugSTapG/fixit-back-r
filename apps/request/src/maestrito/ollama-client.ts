import { Injectable, Logger, BadRequestException, Optional } from '@nestjs/common';

/**
 * Tipo para un mensaje en la conversación
 */
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

/**
 * Respuesta que el modelo debe retornar como JSON
 */
export interface LLMResponse {
    mode: 'MENSAJE' | 'CREAR_SOLICITUD';
    content: string;
    solicitudData?: {
        idTipoServicio?: number;
        codigoParroquia?: string;
        tituloProblema?: string;
        descripcionProblema?: string;
        costoEstimado?: number;
        costoPromocion?: number;
        promocion?: boolean;
        fechaProgramada?: string;
        duracionEstimadaMin?: number;
    };
}

/**
 * Cliente HTTP para comunicación con Ollama
 * Maneja la conversación con modelos LLM vía API REST local
 */
@Injectable()
export class OllamaClient {
    private readonly logger = new Logger(OllamaClient.name);
    private readonly ollamaUrl: string;
    private readonly timeout: number = 120000; // 2 minutos para el LLM

    constructor(@Optional() ollamaUrl?: string) {
        this.ollamaUrl = ollamaUrl || 'http://localhost:11434';
    }

    /**
     * Envía un array de mensajes al modelo y obtiene la respuesta
     *
     * @param model Nombre del modelo en Ollama (ej: "llama2", "mistral")
     * @param messages Array de mensajes de conversación
     * @returns Respuesta del modelo como texto
     */
    async chat(model: string, messages: ChatMessage[]): Promise<string> {
        try {
            this.logger.log(`Calling Ollama model: ${model}`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            try {
                const response = await fetch(`${this.ollamaUrl}/api/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model,
                        messages,
                        stream: false,
                    }),
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorBody = await response.text();
                    this.logger.error(`Ollama error (${response.status}): ${errorBody}`);

                    if (response.status === 404) {
                        throw new BadRequestException(
                            `Modelo ${model} no encontrado en Ollama`
                        );
                    }

                    throw new BadRequestException(
                        `Error en Ollama: ${response.statusText}`
                    );
                }

                const data = await response.json();

                if (!data.message || !data.message.content) {
                    throw new BadRequestException('Invalid response format from Ollama');
                }

                const assistantMessage = data.message.content;
                this.logger.debug(`Ollama response: ${assistantMessage}`);

                return assistantMessage;
            } catch (error) {
                clearTimeout(timeoutId);
                throw error;
            }
        } catch (error) {
            this.logger.error(`Error communicating with Ollama: ${error.message}`);

            if (error.name === 'AbortError') {
                throw new BadRequestException(
                    'La solicitud a Ollama tardó demasiado. Intenta de nuevo.'
                );
            }

            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new BadRequestException(
                    'No se pudo conectar a Ollama. Verifica que el servicio esté corriendo en ' +
                    this.ollamaUrl
                );
            }

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException(
                `Error al comunicarse con Ollama: ${error.message}`
            );
        }
    }

    /**
     * Verifica la conectividad con Ollama
     */
    async healthCheck(): Promise<boolean> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            try {
                const response = await fetch(`${this.ollamaUrl}/api/tags`, {
                    method: 'GET',
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);
                return response.ok;
            } catch (error) {
                clearTimeout(timeoutId);
                throw error;
            }
        } catch (error) {
            this.logger.warn(`Ollama health check failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Obtiene la lista de modelos disponibles en Ollama
     */
    async getAvailableModels(): Promise<string[]> {
        try {
            const response = await fetch(`${this.ollamaUrl}/api/tags`, {
                method: 'GET',
            });

            if (!response.ok) {
                return [];
            }

            const data = await response.json();

            if (!data.models || !Array.isArray(data.models)) {
                return [];
            }

            return data.models.map((model: any) => model.name);
        } catch (error) {
            this.logger.error(`Error fetching available models: ${error.message}`);
            return [];
        }
    }
}
