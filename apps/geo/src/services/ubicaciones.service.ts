import {
    Injectable,
    NotFoundException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { KafkaService } from '@app/events';
import { CreateUbicacionDto, UpdateUbicacionDto } from '../dto';
import { Ubicacion } from '../interfaces';
import { UbicacionMapper } from '../mappers';

@Injectable()
export class UbicacionesService {
    private readonly logger = new Logger(UbicacionesService.name);

    constructor(
        private readonly database: DatabaseService,
        private readonly kafkaService: KafkaService,
    ) { }

    async findAll(
        codigoParroquia?: string,
        nearbyLocation?: [number, number],
        maxDistance?: number,
    ): Promise<Ubicacion[]> {
        if (nearbyLocation && maxDistance) {
            return this.findAllWithSpatialQuery(
                codigoParroquia,
                nearbyLocation,
                maxDistance,
            );
        } else {
            return this.findAllWithRegularQuery(codigoParroquia);
        }
    }

    private async findAllWithSpatialQuery(
        codigoParroquia?: string,
        nearbyLocation?: [number, number],
        maxDistance?: number,
    ): Promise<Ubicacion[]> {
        if (!nearbyLocation) {
            throw new BadRequestException(
                'nearbyLocation es obligatorio para consultas espaciales',
            );
        }

        if (!maxDistance) {
            throw new BadRequestException(
                'maxDistance es obligatorio para consultas espaciales',
            );
        }

        const [longitude, latitude] = nearbyLocation;
        this.logger.log(
            `Spatial query: nearbyLocation=[${longitude}, ${latitude}], maxDistance=${maxDistance}m`,
        );

        // Ejecutar query espacial directamente con raw SQL
        const ubicaciones = await this.database.$queryRaw`
            SELECT 
                u."idUbicacion" as "idUbicacion",
                u."codigoParroquia" as "codigoParroquia", 
                u."nombreUbicacion" as "nombreUbicacion",
                u."descripcionUbicacion" as "descripcionUbicacion",
                u."createdAt" as "createdAt",
                u."updatedAt" as "updatedAt",
                p."codigoParroquia" as "parroquiaCodigo",
                p."nombreParroquia" as "parroquiaNombre",
                c."codigoCanton" as "cantonCodigo", 
                c."nombreCanton" as "cantonNombre",
                pr."codigoProvincia" as "provinciaCodigo", 
                pr."nombreProvincia" as "provinciaNombre",
                ST_X(u.ubicacion) as longitude,
                ST_Y(u.ubicacion) as latitude,
                ST_Distance(
                    u.ubicacion,
                    ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)
                ) * 111000 as distance_meters
            FROM "ubicaciones" u
            LEFT JOIN "parroquias" p ON u."codigoParroquia" = p."codigoParroquia"
            LEFT JOIN "cantones" c ON p."codigoCanton" = c."codigoCanton"
            LEFT JOIN "provincias" pr ON c."codigoProvincia" = pr."codigoProvincia"
            WHERE u.ubicacion IS NOT NULL
            AND ST_DWithin(
                u.ubicacion,
                ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
                ${maxDistance / 111000.0}
            )
            ${codigoParroquia ? `AND u."codigoParroquia" = '${codigoParroquia}'` : ''}
            ORDER BY distance_meters ASC
        `;

        return (ubicaciones as any[]).map((u) =>
            this.mapQueryResultToUbicacion(u),
        );
    }

    private mapQueryResultToUbicacion(u: any): Ubicacion {
        return {
            idUbicacion: u.idUbicacion,
            codigoParroquia: u.codigoParroquia,
            nombreUbicacion: u.nombreUbicacion,
            descripcionUbicacion: u.descripcionUbicacion,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
            ubicacion:
                u.longitude && u.latitude
                    ? {
                        type: 'Point' as const,
                        coordinates: [u.longitude, u.latitude] as [number, number],
                    }
                    : null,
            distanceMeters: u.distance_meters || null,
            parroquia: {
                codigoParroquia: u.parroquiaCodigo,
                nombreParroquia: u.parroquiaNombre,
                codigoCanton: u.cantonCodigo,
                createdAt: new Date(),
                updatedAt: new Date(),
                canton: {
                    codigoCanton: u.cantonCodigo,
                    nombreCanton: u.cantonNombre,
                    codigoProvincia: u.provinciaCodigo,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    provincia: {
                        codigoProvincia: u.provinciaCodigo,
                        nombreProvincia: u.provinciaNombre,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                },
            },
        };
    }

    private async findAllWithRegularQuery(codigoParroquia?: string): Promise<Ubicacion[]> {
        const where: any = {};

        if (codigoParroquia) {
            where.codigoParroquia = codigoParroquia;
        }

        const ubicaciones = await this.database.ubicacion.findMany({
            where,
            include: {
                parroquia: {
                    include: {
                        canton: {
                            include: { provincia: true },
                        },
                    },
                },
            },
            orderBy: { nombreUbicacion: 'asc' },
        });

        return this.addSpatialDataToCollection(ubicaciones);
    }

    async findOne(idUbicacion: number): Promise<Ubicacion> {
        const ubicacion = await this.database.ubicacion.findUnique({
            where: { idUbicacion },
            include: {
                parroquia: {
                    include: {
                        canton: {
                            include: { provincia: true },
                        },
                    },
                },
            },
        });

        if (!ubicacion) {
            throw new NotFoundException(
                `No se encontró la ubicación con ID ${idUbicacion}`,
            );
        }

        return this.addSpatialDataToEntity(ubicacion);
    }

    async findByParroquia(codigoParroquia: string): Promise<Ubicacion[]> {
        const parroquia = await this.database.parroquia.findUnique({
            where: { codigoParroquia },
        });

        if (!parroquia) {
            throw new NotFoundException(
                `No se encontró la parroquia con código ${codigoParroquia}`,
            );
        }

        const ubicaciones = await this.database.ubicacion.findMany({
            where: { codigoParroquia },
            include: {
                parroquia: true,
            },
            orderBy: { nombreUbicacion: 'asc' },
        });

        return this.addSpatialDataToCollection(ubicaciones);
    }

    async create(createUbicacionDto: CreateUbicacionDto): Promise<Ubicacion> {
        const { ubicacion, codigoParroquia, ...restData } = createUbicacionDto;

        const parroquia = await this.database.parroquia.findUnique({
            where: { codigoParroquia },
        });

        if (!parroquia) {
            throw new BadRequestException(
                `No se encontró la parroquia con código ${codigoParroquia}`,
            );
        }

        if (ubicacion) {
            return this.createUbicacionWithCoordinates(
                restData,
                codigoParroquia,
                ubicacion,
            );
        } else {
            const createData = UbicacionMapper.toPrismaCreateData({
                ...restData,
                codigoParroquia,
            });

            const nuevaUbicacion = await this.database.ubicacion.create({
                data: createData,
                include: {
                    parroquia: {
                        include: {
                            canton: {
                                include: { provincia: true },
                            },
                        },
                    },
                },
            });

            await this.kafkaService.publishEvent('geo.ubicacion.created', {
                idUbicacion: nuevaUbicacion.idUbicacion,
                nombreUbicacion: nuevaUbicacion.nombreUbicacion,
                codigoParroquia: nuevaUbicacion.codigoParroquia,
                timestamp: new Date(),
            });

            return this.addSpatialDataToEntity(nuevaUbicacion);
        }
    }

    private async createUbicacionWithCoordinates(
        data: any,
        codigoParroquia: string,
        ubicacion: [number, number],
    ): Promise<Ubicacion> {
        const [longitude, latitude] = ubicacion;

        const result = await this.database.$queryRaw<{ idUbicacion: number }[]>`
            INSERT INTO "ubicaciones" (
                "codigoParroquia", 
                "nombreUbicacion", 
                "descripcionUbicacion", 
                "ubicacion",
                "createdAt",
                "updatedAt"
            ) 
            VALUES (
                ${codigoParroquia}, 
                ${data.nombreUbicacion}, 
                ${data.descripcionUbicacion}, 
                ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
                NOW(),
                NOW()
            )
            RETURNING "idUbicacion"
        `;

        const idUbicacion = result[0]?.idUbicacion;

        await this.kafkaService.publishEvent('geo.ubicacion.created', {
            idUbicacion,
            nombreUbicacion: data.nombreUbicacion,
            codigoParroquia,
            coordinates: [longitude, latitude],
            timestamp: new Date(),
        });

        return this.findOne(idUbicacion);
    }

    async update(idUbicacion: number, updateUbicacionDto: UpdateUbicacionDto): Promise<Ubicacion> {
        const { ubicacion, codigoParroquia, ...updateData } = updateUbicacionDto;

        const existingUbicacion = await this.database.ubicacion.findUnique({
            where: { idUbicacion },
        });

        if (!existingUbicacion) {
            throw new NotFoundException(
                `No se encontró la ubicación con ID ${idUbicacion}`,
            );
        }

        if (codigoParroquia) {
            const parroquia = await this.database.parroquia.findUnique({
                where: { codigoParroquia },
            });

            if (!parroquia) {
                throw new BadRequestException(
                    `No se encontró la parroquia con código ${codigoParroquia}`,
                );
            }
        }

        if (ubicacion) {
            return this.updateUbicacionWithLocation(
                idUbicacion,
                updateData,
                codigoParroquia,
                ubicacion,
            );
        } else {
            const prismaUpdateData = UbicacionMapper.toPrismaUpdateData({
                ...updateData,
                ...(codigoParroquia && { codigoParroquia }),
            });

            const updatedUbicacion = await this.database.ubicacion.update({
                where: { idUbicacion },
                data: prismaUpdateData,
                include: {
                    parroquia: {
                        include: {
                            canton: {
                                include: { provincia: true },
                            },
                        },
                    },
                },
            });

            await this.kafkaService.publishEvent('geo.ubicacion.updated', {
                idUbicacion,
                changes: updateData,
                timestamp: new Date(),
            });

            return this.addSpatialDataToEntity(updatedUbicacion);
        }
    }

    private async updateUbicacionWithLocation(
        idUbicacion: number,
        data: any,
        codigoParroquia?: string,
        ubicacion?: [number, number],
    ): Promise<Ubicacion> {
        if (!ubicacion) {
            throw new BadRequestException('Se requieren coordenadas de ubicación');
        }

        const [longitude, latitude] = ubicacion;

        // Construir la query de actualización dinámicamente
        let updateQuery = `
            UPDATE "ubicaciones" 
            SET "ubicacion" = ST_SetSRID(ST_MakePoint($1, $2), 4326), 
                "updatedAt" = NOW()
        `;

        const params: any[] = [longitude, latitude];
        let paramIndex = 3;

        if (codigoParroquia) {
            updateQuery = updateQuery.replace('SET', `SET "codigoParroquia" = $${paramIndex},`);
            params.push(codigoParroquia);
            paramIndex++;
        }

        if (data.nombreUbicacion !== undefined) {
            updateQuery = updateQuery.replace('SET', `SET "nombreUbicacion" = $${paramIndex},`);
            params.push(data.nombreUbicacion);
            paramIndex++;
        }

        if (data.descripcionUbicacion !== undefined) {
            updateQuery = updateQuery.replace('SET', `SET "descripcionUbicacion" = $${paramIndex},`);
            params.push(data.descripcionUbicacion);
            paramIndex++;
        }

        updateQuery += ` WHERE "idUbicacion" = $${paramIndex}`;
        params.push(idUbicacion);

        await this.database.$executeRawUnsafe(updateQuery, ...params);

        await this.kafkaService.publishEvent('geo.ubicacion.updated', {
            idUbicacion,
            changes: { ...data, coordinates: [longitude, latitude] },
            timestamp: new Date(),
        });

        return this.findOne(idUbicacion);
    }

    async remove(idUbicacion: number): Promise<Ubicacion> {
        const ubicacion = await this.database.ubicacion.findUnique({
            where: { idUbicacion },
        });

        if (!ubicacion) {
            throw new NotFoundException(
                `No se encontró la ubicación con ID ${idUbicacion}`,
            );
        }

        const deletedUbicacion = await this.database.ubicacion.delete({
            where: { idUbicacion },
        });

        await this.kafkaService.publishEvent('geo.ubicacion.deleted', {
            idUbicacion,
            nombreUbicacion: deletedUbicacion.nombreUbicacion,
            timestamp: new Date(),
        });

        return UbicacionMapper.toInterface(deletedUbicacion);
    }

    private async addSpatialDataToCollection(ubicaciones: any[]): Promise<Ubicacion[]> {
        if (!ubicaciones || ubicaciones.length === 0) {
            return ubicaciones.map(u => UbicacionMapper.toInterface(u));
        }

        const ids = ubicaciones.map((u) => u.idUbicacion);

        const locationData = await this.database.$queryRaw<{ id: number, longitude: number, latitude: number }[]>`
            SELECT 
                "idUbicacion" as id, 
                ST_X(ubicacion) as longitude, 
                ST_Y(ubicacion) as latitude 
            FROM "ubicaciones" 
            WHERE "idUbicacion" = ANY(${ids}::int[])
            AND ubicacion IS NOT NULL
        `;

        const locationMap = new Map<number, { type: 'Point'; coordinates: [number, number] }>();
        locationData.forEach((loc: { id: number, longitude: number, latitude: number }) => {
            locationMap.set(loc.id, {
                type: 'Point' as const,
                coordinates: [loc.longitude, loc.latitude],
            });
        });

        return ubicaciones.map((ubicacion) => {
            const coords = locationMap.get(ubicacion.idUbicacion);
            const mapped = UbicacionMapper.toInterface(ubicacion);
            return {
                ...mapped,
                ubicacion: coords || null,
            };
        });
    }

    private async addSpatialDataToEntity(ubicacion: any): Promise<Ubicacion> {
        if (!ubicacion) {
            return UbicacionMapper.toInterface(ubicacion);
        }

        const locationData = await this.database.$queryRaw<{ longitude: number, latitude: number }[]>`
            SELECT 
                ST_X(ubicacion) as longitude, 
                ST_Y(ubicacion) as latitude 
            FROM "ubicaciones" 
            WHERE "idUbicacion" = ${ubicacion.idUbicacion}
            AND ubicacion IS NOT NULL
        `;

        const mapped = UbicacionMapper.toInterface(ubicacion);

        if (locationData && locationData.length > 0) {
            const data = locationData[0];
            return {
                ...mapped,
                ubicacion: {
                    type: 'Point' as const,
                    coordinates: [data.longitude, data.latitude] as [number, number],
                },
            };
        }

        return {
            ...mapped,
            ubicacion: null,
        };
    }
}
