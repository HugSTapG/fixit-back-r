import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { KafkaService, RedisService } from '@app/events';

@Injectable()
export class ProvinciasService {
    private readonly logger = new Logger(ProvinciasService.name);

    constructor(
        private readonly database: DatabaseService,
        private readonly kafkaService: KafkaService,
        private readonly redisService: RedisService,
    ) { }

    async findAll() {
        // Intentar obtener desde cache
        const cached = await this.redisService.getCache('provincias:all');
        if (cached) {
            this.logger.debug('Returning provincias from cache');
            return cached;
        }

        const provincias = await this.database.provincia.findMany({
            include: {
                _count: {
                    select: { cantones: true },
                },
            },
            orderBy: { nombreProvincia: 'asc' },
        });

        // Guardar en cache por 1 hora
        await this.redisService.setCache('provincias:all', provincias, 3600);

        return provincias;
    }

    async findOne(codigoProvincia: string) {
        const cacheKey = `provincia:${codigoProvincia}`;
        const cached = await this.redisService.getCache(cacheKey);
        if (cached) {
            this.logger.debug(`Returning provincia ${codigoProvincia} from cache`);
            return cached;
        }

        const provincia = await this.database.provincia.findUnique({
            where: { codigoProvincia },
            include: {
                cantones: {
                    orderBy: { nombreCanton: 'asc' },
                },
            },
        });

        if (!provincia) {
            throw new NotFoundException(`No se encontró la provincia con código ${codigoProvincia}`);
        }

        // Guardar en cache
        await this.redisService.setCache(cacheKey, provincia, 3600);

        return provincia;
    }

    async create(createProvinciaDto: any) {
        const existingProvincia = await this.database.provincia.findUnique({
            where: { codigoProvincia: createProvinciaDto.codigoProvincia },
        });

        if (existingProvincia) {
            throw new ConflictException(`Ya existe una provincia con el código ${createProvinciaDto.codigoProvincia}`);
        }

        const provincia = await this.database.provincia.create({
            data: createProvinciaDto,
        });

        // Limpiar cache
        await this.redisService.del('provincias:all');

        // Emitir evento
        await this.kafkaService.publishEvent('geo.provincia.created', {
            codigoProvincia: provincia.codigoProvincia,
            nombreProvincia: provincia.nombreProvincia,
            timestamp: new Date(),
        });

        return provincia;
    }

    async update(codigoProvincia: string, updateProvinciaDto: any) {
        await this.findOne(codigoProvincia); // Verifica que existe

        const updatedProvincia = await this.database.provincia.update({
            where: { codigoProvincia },
            data: updateProvinciaDto,
        });

        // Limpiar cache
        await this.redisService.del('provincias:all');
        await this.redisService.del(`provincia:${codigoProvincia}`);

        // Emitir evento
        await this.kafkaService.publishEvent('geo.provincia.updated', {
            codigoProvincia: updatedProvincia.codigoProvincia,
            changes: updateProvinciaDto,
            timestamp: new Date(),
        });

        return updatedProvincia;
    }

    async remove(codigoProvincia: string) {
        const provincia = await this.database.provincia.findUnique({
            where: { codigoProvincia },
            include: { cantones: true },
        });

        if (!provincia) {
            throw new NotFoundException(`No se encontró la provincia con código ${codigoProvincia}`);
        }

        if (provincia.cantones.length > 0) {
            throw new ConflictException('No se puede eliminar una provincia que tiene cantones asociados');
        }

        const deletedProvincia = await this.database.provincia.delete({
            where: { codigoProvincia },
        });

        // Limpiar cache
        await this.redisService.del('provincias:all');
        await this.redisService.del(`provincia:${codigoProvincia}`);

        // Emitir evento
        await this.kafkaService.publishEvent('geo.provincia.deleted', {
            codigoProvincia: deletedProvincia.codigoProvincia,
            timestamp: new Date(),
        });

        return deletedProvincia;
    }
}
