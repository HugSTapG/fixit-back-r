import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { MaestritoService } from './maestrito.service';
import { MaestritoController } from './maestrito.controller';
import { OllamaClient } from './ollama-client';

/**
 * Módulo Maestrito
 * Encapsula toda la lógica de chat inteligente con LLM para crear solicitudes
 */
@Module({
    imports: [
        // Importar cliente REQUEST_SERVICE para comunicarse con el servicio request
        ClientsModule.registerAsync([
            {
                name: 'REQUEST_SERVICE',
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: 'localhost',
                        port: configService.get('REQUEST_SERVICE_PORT', 3305),
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    providers: [
        OllamaClient,
        MaestritoService,
    ],
    controllers: [MaestritoController],
    exports: [
        MaestritoService,
        OllamaClient,
    ],
})
export class MaestritoModule {}
