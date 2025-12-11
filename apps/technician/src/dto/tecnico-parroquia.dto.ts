import {
    IsNotEmpty,
    IsString
} from 'class-validator';

/**
 * DTO para asignar parroquia a técnico
 */
export class CreateTecnicoParroquiaDto {
    /**
     * Código de la parroquia
     */
    @IsNotEmpty({ message: 'El código de la parroquia es obligatorio' })
    @IsString({ message: 'El código de la parroquia debe ser una cadena de texto' })
    codigoParroquia: string;
}
