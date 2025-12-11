import {
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsEnum,
    IsDateString,
    Min
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { EstatusCertificacion } from '@app/shared';


/**
 * DTO para asignar certificación a técnico
 */
export class CreateTecnicoCertificacionDto {
    /**
     * ID de la certificación
     */
    @IsNotEmpty({ message: 'El ID de la certificación es obligatorio' })
    @IsInt({ message: 'El ID de la certificación debe ser un número entero' })
    @Min(1, { message: 'El ID de la certificación debe ser mayor a 0' })
    idCertificacion: number;

    /**
     * Fecha de obtención de la certificación
     */
    @IsNotEmpty({ message: 'La fecha de obtención es obligatoria' })
    @IsDateString({}, { message: 'La fecha de obtención debe tener un formato válido' })
    fechaObtencion: string;

    /**
     * Fecha de vencimiento de la certificación
     */
    @IsNotEmpty({ message: 'La fecha de vencimiento es obligatoria' })
    @IsDateString({}, { message: 'La fecha de vencimiento debe tener un formato válido' })
    fechaVencimiento: string;

    /**
     * Documento de la certificación (opcional)
     */
    @IsOptional()
    documento?: any;

    /**
     * Estatus de la certificación (opcional, por defecto PENDIENTE)
     */
    @IsOptional()
    @IsEnum(EstatusCertificacion, { message: 'El estatus de certificación debe ser válido' })
    estatusCertificacion?: EstatusCertificacion;
}

/**
 * DTO para actualizar certificación de técnico
 */
export class UpdateTecnicoCertificacionDto extends PartialType(CreateTecnicoCertificacionDto) { }
