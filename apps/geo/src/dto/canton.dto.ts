import { IsNotEmpty, IsString, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

/**
 * DTO para la creación de un cantón.
 */
export class CreateCantonDto {
    /**
     * Código único del cantón.
     * @example "0101"
     */
    @IsNotEmpty({ message: 'El código del cantón es obligatorio' })
    @IsString({ message: 'El código debe ser una cadena de texto' })
    @Length(1, 10, { message: 'El código debe tener entre 1 y 10 caracteres' })
    codigoCanton: string;

    /**
     * Código de la provincia a la que pertenece.
     * @example "01"
     */
    @IsNotEmpty({ message: 'El código de la provincia es obligatorio' })
    @IsString({ message: 'El código de la provincia debe ser una cadena de texto' })
    codigoProvincia: string;

    /**
     * Nombre descriptivo del cantón.
     * @example "Cuenca"
     */
    @IsNotEmpty({ message: 'El nombre del cantón es obligatorio' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
    nombreCanton: string;
}

/**
 * DTO para actualizar un cantón existente.
 */
export class UpdateCantonDto extends PartialType(CreateCantonDto) { }
