import {
    IsNotEmpty,
    IsString,
    IsEnum,
    Length
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { SubServicio } from '@app/shared';


/**
 * DTO para crear un tipo de servicio
 */
export class CreateTipoServicioDto {
    /**
     * Nombre del servicio
     */
    @IsNotEmpty({ message: 'El nombre del servicio es obligatorio' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @Length(1, 50, { message: 'El nombre debe tener entre 1 y 50 caracteres' })
    nombreServicio: string;

    /**
     * Descripción del servicio
     */
    @IsNotEmpty({ message: 'La descripción del servicio es obligatoria' })
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcionServicio: string;

    /**
     * Sub-categoría del servicio
     */
    @IsNotEmpty({ message: 'El sub-servicio es obligatorio' })
    @IsEnum(SubServicio, { message: 'El sub-servicio debe ser válido' })
    subServicio: SubServicio;
}

/**
 * DTO para actualizar un tipo de servicio
 */
export class UpdateTipoServicioDto extends PartialType(CreateTipoServicioDto) { }
