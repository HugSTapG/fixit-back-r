import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { KafkaService, RedisService } from '@app/events';
import { CreateParroquiaDto, UpdateParroquiaDto } from '../dto';
import { Parroquia } from '../interfaces';
import { ParroquiaMapper } from '../mappers';

@Injectable()
export class ParroquiasService {
    private readonly logger = new Logger(ParroquiasService.name);

    constructor(
        private readonly database: DatabaseService,
        private readonly kafkaService: KafkaService,
        private readonly redisService: RedisService,
    ) { }

    async findAll(): Promise<Parroquia[]> {
        // Intentar obtener desde cache
        const cached = await this.redisService.getCache<Parroquia[]>('parroquias:all');
        if (cached) {
            this.logger.debug('Returning parroquias from cache');
            return cached;
        }

        const parroquias = await this.database.parroquia.findMany({
            include: {
                canton: {
                    include: { provincia: true },
                },
                _count: {
                    select: { ubicaciones: true },
                },
            },
            orderBy: { nombreParroquia: 'asc' },
        });

        const mappedParroquias = parroquias.map(parroquia => ParroquiaMapper.toInterface(parroquia));

        // Guardar en cache por 30 minutos (más dinámico que provincias/cantones)
        await this.redisService.setCache('parroquias:all', mappedParroquias, 1800);

        return mappedParroquias;
    }

    async findOne(codigoParroquia: string): Promise<Parroquia> {
        const cacheKey = `parroquia:${codigoParroquia}`;
        const cached = await this.redisService.getCache<Parroquia>(cacheKey);
        if (cached) {
            this.logger.debug(`Returning parroquia ${codigoParroquia} from cache`);
            return cached;
        }

        const parroquia = await this.database.parroquia.findUnique({
            where: { codigoParroquia },
            include: {
                canton: {
                    include: { provincia: true },
                },
                ubicaciones: {
                    orderBy: { nombreUbicacion: 'asc' },
                },
            },
        });

        if (!parroquia) {
            throw new NotFoundException(`No se encontró la parroquia con código ${codigoParroquia}`);
        }

        const mappedParroquia = ParroquiaMapper.toInterface(parroquia);

        // Guardar en cache
        await this.redisService.setCache(cacheKey, mappedParroquia, 1800);

        return mappedParroquia;
    }

    async findByCanton(codigoCanton: string): Promise<Parroquia[]> {
        const cacheKey = `parroquias:canton:${codigoCanton}`;
        const cached = await this.redisService.getCache<Parroquia[]>(cacheKey);
        if (cached) {
            this.logger.debug(`Returning parroquias for canton ${codigoCanton} from cache`);
            return cached;
        }

        const canton = await this.database.canton.findUnique({
            where: { codigoCanton },
        });

        if (!canton) {
            throw new NotFoundException(`No se encontró el cantón con código ${codigoCanton}`);
        }

        const parroquias = await this.database.parroquia.findMany({
            where: { codigoCanton },
            include: {
                canton: true,
                _count: {
                    select: { ubicaciones: true },
                },
            },
            orderBy: { nombreParroquia: 'asc' },
        });

        const mappedParroquias = parroquias.map(parroquia => ParroquiaMapper.toInterface(parroquia));

        // Guardar en cache
        await this.redisService.setCache(cacheKey, mappedParroquias, 1800);

        return mappedParroquias;
    }

    async create(createParroquiaDto: CreateParroquiaDto): Promise<Parroquia> {
        // Verificar que no existe
        const existingParroquia = await this.database.parroquia.findUnique({
            where: { codigoParroquia: createParroquiaDto.codigoParroquia },
        });

        if (existingParroquia) {
            throw new ConflictException(`Ya existe una parroquia con el código ${createParroquiaDto.codigoParroquia}`);
        }

        // Verificar que el cantón existe
        const canton = await this.database.canton.findUnique({
            where: { codigoCanton: createParroquiaDto.codigoCanton },
        });

        if (!canton) {
            throw new BadRequestException(`No se encontró el cantón con código ${createParroquiaDto.codigoCanton}`);
        }

        const createData = ParroquiaMapper.toPrismaCreateData(createParroquiaDto);

        const parroquia = await this.database.parroquia.create({
            data: createData,
            include: {
                canton: {
                    include: { provincia: true },
                },
            },
        });

        // Limpiar caches relacionados
        await this.redisService.del('parroquias:all');
        await this.redisService.del(`parroquias:canton:${createParroquiaDto.codigoCanton}`);

        // Emitir evento
        await this.kafkaService.publishEvent('geo.parroquia.created', {
            codigoParroquia: parroquia.codigoParroquia,
            nombreParroquia: parroquia.nombreParroquia,
            codigoCanton: parroquia.codigoCanton,
            timestamp: new Date(),
        });

        return ParroquiaMapper.toInterface(parroquia);
    }

    async update(codigoParroquia: string, updateParroquiaDto: UpdateParroquiaDto): Promise<Parroquia> {
        await this.findOne(codigoParroquia); // Verifica que existe

        if (updateParroquiaDto.codigoCanton) {
            const canton = await this.database.canton.findUnique({
                where: { codigoCanton: updateParroquiaDto.codigoCanton },
            });

            if (!canton) {
                throw new BadRequestException(`No se encontró el cantón con código ${updateParroquiaDto.codigoCanton}`);
            }
        }

        const updateData = ParroquiaMapper.toPrismaUpdateData(updateParroquiaDto);

        const updatedParroquia = await this.database.parroquia.update({
            where: { codigoParroquia },
            data: updateData,
            include: {
                canton: {
                    include: { provincia: true },
                },
            },
        });

        // Limpiar caches relacionados
        await this.redisService.del('parroquias:all');
        await this.redisService.del(`parroquia:${codigoParroquia}`);
        if (updateParroquiaDto.codigoCanton) {
            await this.redisService.del(`parroquias:canton:${updateParroquiaDto.codigoCanton}`);
        }

        // Emitir evento
        await this.kafkaService.publishEvent('geo.parroquia.updated', {
            codigoParroquia: updatedParroquia.codigoParroquia,
            changes: updateParroquiaDto,
            timestamp: new Date(),
        });

        return ParroquiaMapper.toInterface(updatedParroquia);
    }

    async remove(codigoParroquia: string): Promise<Parroquia> {
        const parroquia = await this.database.parroquia.findUnique({
            where: { codigoParroquia },
            include: {
                ubicaciones: true,
                canton: true
            },
        });

        if (!parroquia) {
            throw new NotFoundException(`No se encontró la parroquia con código ${codigoParroquia}`);
        }

        if (parroquia.ubicaciones.length > 0) {
            throw new ConflictException('No se puede eliminar una parroquia que tiene ubicaciones asociadas');
        }

        const deletedParroquia = await this.database.parroquia.delete({
            where: { codigoParroquia },
        });

        // Limpiar caches relacionados
        await this.redisService.del('parroquias:all');
        await this.redisService.del(`parroquia:${codigoParroquia}`);
        await this.redisService.del(`parroquias:canton:${parroquia.codigoCanton}`);

        // Emitir evento
        await this.kafkaService.publishEvent('geo.parroquia.deleted', {
            codigoParroquia: deletedParroquia.codigoParroquia,
            codigoCanton: parroquia.codigoCanton,
            timestamp: new Date(),
        });

        return ParroquiaMapper.toInterface(deletedParroquia);
    }
}
