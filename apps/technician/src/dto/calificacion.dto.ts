import {
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsString,
    IsEnum,
    Min,
    Length
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { PuntajeCalificacion } from '@app/shared';

/**
 * DTO para crear una calificación
 */
export class CreateCalificacionDto {
    /**
     * ID de la solicitud que se está calificando
     */
    @IsNotEmpty({ message: 'El ID de la solicitud es obligatorio' })
    @IsInt({ message: 'El ID de la solicitud debe ser un número entero' })
    @Min(1, { message: 'El ID de la solicitud debe ser mayor a 0' })
    idSolicitud: number;

    /**
     * ID del técnico que se está calificando
     */
    @IsNotEmpty({ message: 'El ID del técnico es obligatorio' })
    @IsInt({ message: 'El ID del técnico debe ser un número entero' })
    @Min(1, { message: 'El ID del técnico debe ser mayor a 0' })
    idTecnico: number;

    /**
     * Puntaje de la calificación
     */
    @IsNotEmpty({ message: 'El puntaje es obligatorio' })
    @IsEnum(PuntajeCalificacion, { message: 'El puntaje debe ser un valor válido' })
    puntaje: PuntajeCalificacion;

    /**
     * Comentario adicional sobre el servicio
     */
    @IsOptional()
    @IsString({ message: 'El comentario debe ser una cadena de texto' })
    @Length(0, 500, { message: 'El comentario no puede exceder 500 caracteres' })
    comentario?: string;
}

/**
 * DTO para actualizar una calificación
 */
export class UpdateCalificacionDto extends PartialType(CreateCalificacionDto) { }

/**
 * DTO para filtrar calificaciones
 */
export class CalificacionFilterDto {
    /**
     * ID del técnico para filtrar calificaciones
     */
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt({ message: 'El ID del técnico debe ser un número entero' })
    idTecnico?: number;

    /**
     * ID de la solicitud para filtrar calificaciones
     */
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt({ message: 'El ID de la solicitud debe ser un número entero' })
    idSolicitud?: number;

    /**
     * Puntaje específico para filtrar
     */
    @IsOptional()
    @IsEnum(PuntajeCalificacion, { message: 'El puntaje debe ser un valor válido' })
    puntaje?: PuntajeCalificacion;

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
