import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { KafkaService, RedisService } from '@app/events';
import { CreateCantonDto, UpdateCantonDto } from '../dto';
import { Canton } from '../interfaces';
import { CantonMapper } from '../mappers';

@Injectable()
export class CantonesService {
    private readonly logger = new Logger(CantonesService.name);

    constructor(
        private readonly database: DatabaseService,
        private readonly kafkaService: KafkaService,
        private readonly redisService: RedisService,
    ) { }

    async findAll(): Promise<Canton[]> {
        // Intentar obtener desde cache
        const cached = await this.redisService.getCache<Canton[]>('cantones:all');
        if (cached) {
            this.logger.debug('Returning cantones from cache');
            return cached;
        }

        const cantones = await this.database.canton.findMany({
            include: {
                provincia: true,
                _count: {
                    select: { parroquias: true },
                },
            },
            orderBy: { nombreCanton: 'asc' },
        });

        const mappedCantones = cantones.map(canton => CantonMapper.toInterface(canton));

        // Guardar en cache por 1 hora
        await this.redisService.setCache('cantones:all', mappedCantones, 3600);

        return mappedCantones;
    }

    async findOne(codigoCanton: string): Promise<Canton> {
        const cacheKey = `canton:${codigoCanton}`;
        const cached = await this.redisService.getCache<Canton>(cacheKey);
        if (cached) {
            this.logger.debug(`Returning canton ${codigoCanton} from cache`);
            return cached;
        }

        const canton = await this.database.canton.findUnique({
            where: { codigoCanton },
            include: {
                provincia: true,
                parroquias: {
                    orderBy: { nombreParroquia: 'asc' },
                },
            },
        });

        if (!canton) {
            throw new NotFoundException(`No se encontró el cantón con código ${codigoCanton}`);
        }

        const mappedCanton = CantonMapper.toInterface(canton);

        // Guardar en cache
        await this.redisService.setCache(cacheKey, mappedCanton, 3600);

        return mappedCanton;
    }

    async findByProvincia(codigoProvincia: string): Promise<Canton[]> {
        const cacheKey = `cantones:provincia:${codigoProvincia}`;
        const cached = await this.redisService.getCache<Canton[]>(cacheKey);
        if (cached) {
            this.logger.debug(`Returning cantones for provincia ${codigoProvincia} from cache`);
            return cached;
        }

        const provincia = await this.database.provincia.findUnique({
            where: { codigoProvincia },
        });

        if (!provincia) {
            throw new NotFoundException(`No se encontró la provincia con código ${codigoProvincia}`);
        }

        const cantones = await this.database.canton.findMany({
            where: { codigoProvincia },
            include: {
                provincia: true,
                _count: {
                    select: { parroquias: true },
                },
            },
            orderBy: { nombreCanton: 'asc' },
        });

        const mappedCantones = cantones.map(canton => CantonMapper.toInterface(canton));

        // Guardar en cache
        await this.redisService.setCache(cacheKey, mappedCantones, 3600);

        return mappedCantones;
    }

    async create(createCantonDto: CreateCantonDto): Promise<Canton> {
        // Verificar que no existe
        const existingCanton = await this.database.canton.findUnique({
            where: { codigoCanton: createCantonDto.codigoCanton },
        });

        if (existingCanton) {
            throw new ConflictException(`Ya existe un cantón con el código ${createCantonDto.codigoCanton}`);
        }

        // Verificar que la provincia existe
        const provincia = await this.database.provincia.findUnique({
            where: { codigoProvincia: createCantonDto.codigoProvincia },
        });

        if (!provincia) {
            throw new BadRequestException(`No se encontró la provincia con código ${createCantonDto.codigoProvincia}`);
        }

        const createData = CantonMapper.toPrismaCreateData(createCantonDto);

        const canton = await this.database.canton.create({
            data: createData,
            include: { provincia: true },
        });

        // Limpiar caches relacionados
        await this.redisService.del('cantones:all');
        await this.redisService.del(`cantones:provincia:${createCantonDto.codigoProvincia}`);

        // Emitir evento
        await this.kafkaService.publishEvent('geo.canton.created', {
            codigoCanton: canton.codigoCanton,
            nombreCanton: canton.nombreCanton,
            codigoProvincia: canton.codigoProvincia,
            timestamp: new Date(),
        });

        return CantonMapper.toInterface(canton);
    }

    async update(codigoCanton: string, updateCantonDto: UpdateCantonDto): Promise<Canton> {
        await this.findOne(codigoCanton); // Verifica que existe

        if (updateCantonDto.codigoProvincia) {
            const provincia = await this.database.provincia.findUnique({
                where: { codigoProvincia: updateCantonDto.codigoProvincia },
            });

            if (!provincia) {
                throw new BadRequestException(`No se encontró la provincia con código ${updateCantonDto.codigoProvincia}`);
            }
        }

        const updateData = CantonMapper.toPrismaUpdateData(updateCantonDto);

        const updatedCanton = await this.database.canton.update({
            where: { codigoCanton },
            data: updateData,
            include: { provincia: true },
        });

        // Limpiar caches relacionados
        await this.redisService.del('cantones:all');
        await this.redisService.del(`canton:${codigoCanton}`);
        if (updateCantonDto.codigoProvincia) {
            await this.redisService.del(`cantones:provincia:${updateCantonDto.codigoProvincia}`);
        }

        // Emitir evento
        await this.kafkaService.publishEvent('geo.canton.updated', {
            codigoCanton: updatedCanton.codigoCanton,
            changes: updateCantonDto,
            timestamp: new Date(),
        });

        return CantonMapper.toInterface(updatedCanton);
    }

    async remove(codigoCanton: string): Promise<Canton> {
        const canton = await this.database.canton.findUnique({
            where: { codigoCanton },
            include: {
                parroquias: true,
                provincia: true
            },
        });

        if (!canton) {
            throw new NotFoundException(`No se encontró el cantón con código ${codigoCanton}`);
        }

        if (canton.parroquias.length > 0) {
            throw new ConflictException('No se puede eliminar un cantón que tiene parroquias asociadas');
        }

        const deletedCanton = await this.database.canton.delete({
            where: { codigoCanton },
        });

        // Limpiar caches relacionados
        await this.redisService.del('cantones:all');
        await this.redisService.del(`canton:${codigoCanton}`);
        await this.redisService.del(`cantones:provincia:${canton.codigoProvincia}`);

        // Emitir evento
        await this.kafkaService.publishEvent('geo.canton.deleted', {
            codigoCanton: deletedCanton.codigoCanton,
            codigoProvincia: canton.codigoProvincia,
            timestamp: new Date(),
        });

        return CantonMapper.toInterface(deletedCanton);
    }
}
