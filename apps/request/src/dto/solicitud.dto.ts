import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsEnum,
    IsNumber,
    IsBoolean,
    IsInt,
    Length,
    Min,
    IsDateString
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { EstadoSolicitud } from '@app/shared';


/**
 * DTO para la creación de una solicitud de servicio
 */
export class CreateSolicitudDto {
    /**
     * ID del tipo de servicio solicitado
     */
    @IsNotEmpty({ message: 'El tipo de servicio es obligatorio' })
    @IsInt({ message: 'El ID del tipo de servicio debe ser un número entero' })
    @Min(1, { message: 'El ID del tipo de servicio debe ser mayor a 0' })
    idTipoServicio: number;

    /**
     * Código de la parroquia donde se realizará el servicio
     */
    @IsNotEmpty({ message: 'El código de parroquia es obligatorio' })
    @IsString({ message: 'El código de parroquia debe ser una cadena de texto' })
    codigoParroquia: string;

    /**
     * Título del problema a resolver
     */
    @IsNotEmpty({ message: 'El título del problema es obligatorio' })
    @IsString({ message: 'El título debe ser una cadena de texto' })
    @Length(5, 100, { message: 'El título debe tener entre 5 y 100 caracteres' })
    tituloProblema: string;

    /**
     * Descripción detallada del problema
     */
    @IsNotEmpty({ message: 'La descripción del problema es obligatoria' })
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @Length(20, 1000, { message: 'La descripción debe tener entre 20 y 1000 caracteres' })
    descripcionProblema: string;

    /**
     * Costo estimado del servicio (opcional)
     */
    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El costo estimado debe ser un número válido con máximo 2 decimales' })
    @Min(0, { message: 'El costo estimado debe ser mayor o igual a 0' })
    costoEstimado?: number;

    /**
     * Costo promocional (opcional)
     */
    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El costo promocional debe ser un número válido con máximo 2 decimales' })
    @Min(0, { message: 'El costo promocional debe ser mayor o igual a 0' })
    costoPromocion?: number;

    /**
     * Indica si la solicitud tiene promoción
     */
    @IsOptional()
    @IsBoolean({ message: 'El campo promoción debe ser verdadero o falso' })
    promocion?: boolean;

    /**
     * Fecha programada para el servicio (opcional)
     */
    @IsOptional()
    @IsDateString({}, { message: 'La fecha programada debe tener un formato válido' })
    fechaProgramada?: string;

    /**
     * Duración estimada en minutos (opcional)
     */
    @IsOptional()
    @IsInt({ message: 'La duración estimada debe ser un número entero' })
    @Min(15, { message: 'La duración mínima debe ser de 15 minutos' })
    duracionEstimadaMin?: number;
}

/**
 * DTO para actualizar una solicitud existente
 */
export class UpdateSolicitudDto extends PartialType(CreateSolicitudDto) {
    /**
     * Estado de la solicitud
     */
    @IsOptional()
    @IsEnum(EstadoSolicitud, { message: 'El estado de la solicitud debe ser válido' })
    estadoSolicitud?: EstadoSolicitud;

    /**
     * Fecha de inicio del servicio (solo para técnicos)
     */
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de inicio debe tener un formato válido' })
    fechaInicio?: string;

    /**
     * Fecha de finalización del servicio (solo para técnicos)
     */
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de finalización debe tener un formato válido' })
    fechaFinalizacion?: string;

    /**
     * ID del usuario que actualiza (para auditoría)
     */
    @IsOptional()
    @IsInt()
    updatedBy?: number;
}

/**
 * DTO para filtrar solicitudes
 */
export class SolicitudFilterDto {
    /**
     * Estado de la solicitud para filtrar
     */
    @IsOptional()
    @IsEnum(EstadoSolicitud, { message: 'El estado de filtro debe ser válido' })
    estadoSolicitud?: EstadoSolicitud;

    /**
     * ID del tipo de servicio para filtrar
     */
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt({ message: 'El ID del tipo de servicio debe ser un número entero' })
    idTipoServicio?: number;

    /**
     * Código de parroquia para filtrar
     */
    @IsOptional()
    @IsString({ message: 'El código de parroquia debe ser una cadena de texto' })
    codigoParroquia?: string;

    /**
     * Buscar solo solicitudes con promoción
     */
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    promocion?: boolean;

    /**
     * ID del usuario para filtrar sus solicitudes
     */
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt({ message: 'El ID del usuario debe ser un número entero' })
    idUser?: number;

    /**
     * Límite de resultados
     */
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt({ message: 'El límite debe ser un número entero' })
    @Min(1, { message: 'El límite mínimo es 1' })
    limit?: number;

    /**
     * Página para paginación
     */
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt({ message: 'La página debe ser un número entero' })
    @Min(1, { message: 'La página mínima es 1' })
    page?: number;
}
