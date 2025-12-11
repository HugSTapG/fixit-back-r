import {
    IsNotEmpty,
    IsString,
    IsOptional,
    Length
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

/**
 * DTO para crear una certificación
 */
export class CreateCertificacionDto {
    /**
     * Nombre de la certificación
     */
    @IsNotEmpty({ message: 'El nombre de la certificación es obligatorio' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
    nombreCertificacion: string;

    /**
     * Entidad que otorga la certificación
     */
    @IsNotEmpty({ message: 'La entidad certificadora es obligatoria' })
    @IsString({ message: 'La entidad debe ser una cadena de texto' })
    @Length(1, 100, { message: 'La entidad debe tener entre 1 y 100 caracteres' })
    entidadCertificacion: string;

    /**
     * Descripción de la certificación (opcional)
     */
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcionCertificacion?: string;
}

/**
 * DTO para actualizar una certificación
 */
export class UpdateCertificacionDto extends PartialType(CreateCertificacionDto) { }
