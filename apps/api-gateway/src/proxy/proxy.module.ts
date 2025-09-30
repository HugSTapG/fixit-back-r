import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { MicroserviceProxyService } from './services/microservice-proxy.service';
import { AuthProxyService } from './services/auth-proxy.service';
import { GeoProxyService } from './services/geo-proxy.service';
import { TechnicianProxyService } from './services/technician-proxy.service';
import { RequestProxyService } from './services/request-proxy.service';
import { PaymentProxyService } from './services/payment-proxy.service';
import { NotificationProxyService } from './services/notification-proxy.service';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'AUTH_SERVICE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: 'localhost',
                        port: configService.get('AUTH_SERVICE_PORT', 3301),
                    },
                }),
                inject: [ConfigService],
            },
            {
                name: 'GEO_SERVICE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: 'localhost',
                        port: configService.get('GEO_SERVICE_PORT', 3302),
                    },
                }),
                inject: [ConfigService],
            },
            {
                name: 'TECHNICIAN_SERVICE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: 'localhost',
                        port: configService.get('TECHNICIAN_SERVICE_PORT', 3304),
                    },
                }),
                inject: [ConfigService],
            },
            {
                name: 'REQUEST_SERVICE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: 'localhost',
                        port: configService.get('REQUEST_SERVICE_PORT', 3305),
                    },
                }),
                inject: [ConfigService],
            },
            {
                name: 'PAYMENT_SERVICE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: 'localhost',
                        port: configService.get('PAYMENT_SERVICE_PORT', 3306),
                    },
                }),
                inject: [ConfigService],
            },
            {
                name: 'NOTIFICATION_SERVICE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: 'localhost',
                        port: configService.get('NOTIFICATION_SERVICE_PORT', 3307),
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    providers: [
        MicroserviceProxyService,
        AuthProxyService,
        GeoProxyService,
        TechnicianProxyService,
        RequestProxyService,
        PaymentProxyService,
        NotificationProxyService,
    ],
    exports: [
        MicroserviceProxyService,
        AuthProxyService,
        GeoProxyService,
        TechnicianProxyService,
        RequestProxyService,
        PaymentProxyService,
        NotificationProxyService,
    ],
})
export class ProxyModule { }
