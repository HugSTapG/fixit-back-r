import {
    IsNotEmpty,
    IsInt,
    Min
} from 'class-validator';

/**
 * DTO para asignar servicio a técnico
 */
export class CreateTecnicoServicioDto {
    /**
     * ID del tipo de servicio
     */
    @IsNotEmpty({ message: 'El ID del tipo de servicio es obligatorio' })
    @IsInt({ message: 'El ID del tipo de servicio debe ser un número entero' })
    @Min(1, { message: 'El ID del tipo de servicio debe ser mayor a 0' })
    idTipoServicio: number;
}
