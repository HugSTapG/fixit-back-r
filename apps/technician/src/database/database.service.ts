import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../prismaClientTechnician/generated';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(DatabaseService.name);

    constructor(private readonly configService: ConfigService) {
        super({
            datasources: {
                db: {
                    url: configService.get('TECHNICIAN_DATABASE_URL'),
                },
            },
            log: ['query', 'info', 'warn', 'error'],
        });
    }

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Connected to Technician Service database');

            // Verificar conexión con una query simple
            await this.$queryRaw`SELECT 1`;
            this.logger.log('Technician database connection verified');
        } catch (error) {
            this.logger.error('Failed to connect to Technician Service database:', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        try {
            await this.$disconnect();
            this.logger.log('Disconnected from Technician Service database');
        } catch (error) {
            this.logger.error('Error disconnecting from Technician database:', error);
        }
    }

    /**
     * Método helper para ejecutar queries en transacciones
     */
    async executeInTransaction<T>(
        callback: (prisma: PrismaClient) => Promise<T>
    ): Promise<T> {
        return this.$transaction(callback);
    }

    /**
     * Método helper para verificar la salud de la base de datos
     */
    async healthCheck(): Promise<boolean> {
        try {
            await this.$queryRaw`SELECT 1`;
            return true;
        } catch (error) {
            this.logger.error('Database health check failed:', error);
            return false;
        }
    }

    /**
     * Método helper para obtener estadísticas generales de la base de datos
     */
    async getDatabaseStats() {
        try {
            const [
                tecnicosCount,
                certificacionesCount,
                tecnicoCertificacionesCount,
                tiposServiciosCount,
                calificacionesCount
            ] = await Promise.all([
                this.tecnico.count(),
                this.certificacion.count(),
                this.tecnicoCertificacion.count(),
                this.tipoServicio.count(),
                this.calificacion.count()
            ]);

            return {
                tecnicos: tecnicosCount,
                certificaciones: certificacionesCount,
                tecnicoCertificaciones: tecnicoCertificacionesCount,
                tiposServicios: tiposServiciosCount,
                calificaciones: calificacionesCount,
                timestamp: new Date()
            };
        } catch (error) {
            this.logger.error('Error getting database stats:', error);
            throw error;
        }
    }

    /**
     * Método helper para limpiar datos de prueba (solo en desarrollo)
     */
    async cleanTestData() {
        if (this.configService.get('NODE_ENV') === 'production') {
            throw new Error('Cannot clean data in production environment');
        }

        try {
            await this.$transaction(async (prisma) => {
                // Eliminar en orden para respetar las foreign keys
                await prisma.calificacion.deleteMany();
                await prisma.solicitudTecnico.deleteMany();
                await prisma.tecnicoServicio.deleteMany();
                await prisma.tecnicoParroquia.deleteMany();
                await prisma.tecnicoCertificacion.deleteMany();
                await prisma.tecnico.deleteMany();
                await prisma.certificacion.deleteMany();
                await prisma.tipoServicio.deleteMany();
            });

            this.logger.log('Test data cleaned successfully');
        } catch (error) {
            this.logger.error('Error cleaning test data:', error);
            throw error;
        }
    }

    /**
     * Método helper para crear datos de desarrollo
     */
    async seedDevelopmentData() {
        if (this.configService.get('NODE_ENV') === 'production') {
            throw new Error('Cannot seed data in production environment');
        }

        try {
            // Solo crear datos si no existen
            const existingData = await this.getDatabaseStats();

            if (existingData.certificaciones > 0) {
                this.logger.log('Development data already exists, skipping seed');
                return;
            }

            await this.$transaction(async (prisma) => {
                // Crear certificaciones de ejemplo
                const certificaciones = await Promise.all([
                    prisma.certificacion.create({
                        data: {
                            nombreCertificacion: 'Certificación en Electricidad Básica',
                            entidadCertificacion: 'SECAP',
                            descripcionCertificacion: 'Certificación básica para instalaciones eléctricas residenciales'
                        }
                    }),
                    prisma.certificacion.create({
                        data: {
                            nombreCertificacion: 'Técnico en Plomería',
                            entidadCertificacion: 'INEN',
                            descripcionCertificacion: 'Certificación para instalaciones sanitarias'
                        }
                    }),
                    prisma.certificacion.create({
                        data: {
                            nombreCertificacion: 'Técnico en Aires Acondicionados',
                            entidadCertificacion: 'Ministerio de Trabajo',
                            descripcionCertificacion: 'Certificación para mantenimiento de sistemas HVAC'
                        }
                    })
                ]);

                // Crear tipos de servicios de ejemplo
                const tiposServicios = await Promise.all([
                    prisma.tipoServicio.create({
                        data: {
                            nombreServicio: 'Instalación Eléctrica',
                            descripcionServicio: 'Instalación de sistemas eléctricos residenciales y comerciales',
                            subServicio: 'INSTALACION'
                        }
                    }),
                    prisma.tipoServicio.create({
                        data: {
                            nombreServicio: 'Reparación de Plomería',
                            descripcionServicio: 'Reparación y mantenimiento de sistemas de agua y drenaje',
                            subServicio: 'REPARACION'
                        }
                    }),
                    prisma.tipoServicio.create({
                        data: {
                            nombreServicio: 'Mantenimiento HVAC',
                            descripcionServicio: 'Mantenimiento de sistemas de calefacción, ventilación y aire acondicionado',
                            subServicio: 'MANTENIMIENTO'
                        }
                    }),
                    prisma.tipoServicio.create({
                        data: {
                            nombreServicio: 'Revisión Técnica',
                            descripcionServicio: 'Inspección y diagnóstico de equipos y sistemas',
                            subServicio: 'REVISION'
                        }
                    })
                ]);

                this.logger.log(`Created ${certificaciones.length} certificaciones and ${tiposServicios.length} tipos de servicios`);
            });

            this.logger.log('Development data seeded successfully');
        } catch (error) {
            this.logger.error('Error seeding development data:', error);
            throw error;
        }
    }
}
