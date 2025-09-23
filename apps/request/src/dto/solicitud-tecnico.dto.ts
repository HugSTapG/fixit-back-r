import {
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsString,
    IsEnum,
    IsNumber,
    Min,
    Length
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { EstadoAceptacion } from '@app/shared';

/**
 * DTO para crear una propuesta de técnico a una solicitud
 */
export class CreateSolicitudTecnicoDto {
    /**
     * ID de la solicitud
     */
    @IsNotEmpty({ message: 'El ID de la solicitud es obligatorio' })
    @IsInt({ message: 'El ID de la solicitud debe ser un número entero' })
    @Min(1, { message: 'El ID de la solicitud debe ser mayor a 0' })
    idSolicitud: number;

    /**
     * Costo acordado para el servicio (opcional en la propuesta inicial)
     */
    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El costo acordado debe ser un número válido con máximo 2 decimales' })
    @Min(0, { message: 'El costo acordado debe ser mayor o igual a 0' })
    costoAcordado?: number;

    /**
     * Notas adicionales del técnico
     */
    @IsOptional()
    @IsString({ message: 'Las notas deben ser una cadena de texto' })
    @Length(0, 500, { message: 'Las notas no pueden exceder 500 caracteres' })
    notas?: string;
}

/**
 * DTO para actualizar una propuesta técnico-solicitud
 */
export class UpdateSolicitudTecnicoDto extends PartialType(CreateSolicitudTecnicoDto) {
    /**
     * Estado del acuerdo entre técnico y cliente
     */
    @IsOptional()
    @IsEnum(EstadoAceptacion, { message: 'El estado de aceptación debe ser válido' })
    estadoAcuerdo?: EstadoAceptacion;
}

/**
 * DTO para responder a una solicitud (aceptar/rechazar)
 */
export class ResponderSolicitudDto {
    /**
     * Estado de la respuesta
     */
    @IsNotEmpty({ message: 'El estado de aceptación es obligatorio' })
    @IsEnum(EstadoAceptacion, { message: 'El estado de aceptación debe ser válido' })
    estadoAcuerdo: EstadoAceptacion;

    /**
     * Costo propuesto por el técnico
     */
    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El costo acordado debe ser un número válido con máximo 2 decimales' })
    @Min(0, { message: 'El costo acordado debe ser mayor o igual a 0' })
    costoAcordado?: number;

    /**
     * Notas del técnico
     */
    @IsOptional()
    @IsString({ message: 'Las notas deben ser una cadena de texto' })
    @Length(0, 500, { message: 'Las notas no pueden exceder 500 caracteres' })
    notas?: string;
}
