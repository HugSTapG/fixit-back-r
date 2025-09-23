import {
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsBoolean,
    Min
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';

/**
 * DTO para crear un técnico
 */
export class CreateTecnicoDto {
    /**
     * ID del usuario que será técnico
     */
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
    @IsInt({ message: 'El ID del usuario debe ser un número entero' })
    @Min(1, { message: 'El ID del usuario debe ser mayor a 0' })
    idUser: number;

    /**
     * Estado activo del técnico (opcional)
     */
    @IsOptional()
    @IsBoolean({ message: 'El estado activo debe ser verdadero o falso' })
    isActive?: boolean;
}

/**
 * DTO para actualizar un técnico existente
 */
export class UpdateTecnicoDto extends PartialType(CreateTecnicoDto) { }

/**
 * DTO para filtrar técnicos
 */
export class TecnicoFilterDto {
    /**
     * Estado activo para filtrar
     */
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean({ message: 'El estado activo debe ser verdadero o falso' })
    isActive?: boolean;

    /**
     * Código de parroquia para filtrar técnicos por ubicación
     */
    @IsOptional()
    codigoParroquia?: string;

    /**
     * ID del tipo de servicio para filtrar especialidades
     */
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt({ message: 'El ID del tipo de servicio debe ser un número entero' })
    idTipoServicio?: number;

    /**
     * Calificación mínima
     */
    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    calificacionMinima?: number;

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
