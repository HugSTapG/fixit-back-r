import { IsNotEmpty, IsString, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

/**
 * DTO para la creación de una parroquia.
 */
export class CreateParroquiaDto {
    /**
     * Código único de la parroquia.
     * @example "010101"
     */
    @IsNotEmpty({ message: 'El código de la parroquia es obligatorio' })
    @IsString({ message: 'El código debe ser una cadena de texto' })
    @Length(1, 10, { message: 'El código debe tener entre 1 y 10 caracteres' })
    codigoParroquia: string;

    /**
     * Código del cantón al que pertenece.
     * @example "0101"
     */
    @IsNotEmpty({ message: 'El código del cantón es obligatorio' })
    @IsString({ message: 'El código del cantón debe ser una cadena de texto' })
    codigoCanton: string;

    /**
     * Nombre descriptivo de la parroquia.
     * @example "El Sagrario"
     */
    @IsNotEmpty({ message: 'El nombre de la parroquia es obligatorio' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
    nombreParroquia: string;
}

/**
 * DTO para actualizar una parroquia existente.
 */
export class UpdateParroquiaDto extends PartialType(CreateParroquiaDto) { }
