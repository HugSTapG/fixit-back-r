import { IsNotEmpty, IsString, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

/**
 * DTO para la creación de una provincia.
 */
export class CreateProvinciaDto {
    /**
     * Código único de la provincia.
     * @example "01"
     */
    @IsNotEmpty({ message: 'El código de la provincia es obligatorio' })
    @IsString({ message: 'El código debe ser una cadena de texto' })
    @Length(1, 10, { message: 'El código debe tener entre 1 y 10 caracteres' })
    codigoProvincia: string;

    /**
     * Nombre descriptivo de la provincia.
     * @example "Azuay"
     */
    @IsNotEmpty({ message: 'El nombre de la provincia es obligatorio' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
    nombreProvincia: string;
}

/**
 * DTO para actualizar una provincia existente.
 */
export class UpdateProvinciaDto extends PartialType(CreateProvinciaDto) { }
