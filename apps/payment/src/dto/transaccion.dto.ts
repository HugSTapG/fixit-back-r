import {
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsEnum,
    IsNumber,
    Min,
    IsDateString
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { EstadoPago, MetodoPago } from '@app/shared';


/**
 * DTO para crear una transacción
 */
export class CreateTransaccionDto {
    /**
     * ID de la solicitud asociada a la transacción
     */
    @IsNotEmpty({ message: 'El ID de la solicitud es obligatorio' })
    @IsInt({ message: 'El ID de la solicitud debe ser un número entero' })
    @Min(1, { message: 'El ID de la solicitud debe ser mayor a 0' })
    idSolicitud: number;

    /**
     * Monto de la transacción
     */
    @IsNotEmpty({ message: 'El monto es obligatorio' })
    @Transform(({ value }) => parseFloat(value))
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El monto debe ser un número válido con máximo 2 decimales' })
    @Min(0.01, { message: 'El monto debe ser mayor a 0' })
    monto: number;

    /**
     * Método de pago utilizado
     */
    @IsNotEmpty({ message: 'El método de pago es obligatorio' })
    @IsEnum(MetodoPago, { message: 'El método de pago debe ser válido' })
    metodoPago: MetodoPago;

    /**
     * Fecha del pago (opcional, se puede establecer automáticamente)
     */
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de pago debe tener un formato válido' })
    fechaPago?: string;
}

/**
 * DTO para actualizar una transacción
 */
export class UpdateTransaccionDto extends PartialType(CreateTransaccionDto) {
    /**
     * Estado del pago
     */
    @IsOptional()
    @IsEnum(EstadoPago, { message: 'El estado del pago debe ser válido' })
    estadoPago?: EstadoPago;
}

/**
 * DTO para procesar un pago
 */
export class ProcesarPagoDto {
    /**
     * Método de pago a utilizar
     */
    @IsNotEmpty({ message: 'El método de pago es obligatorio' })
    @IsEnum(MetodoPago, { message: 'El método de pago debe ser válido' })
    metodoPago: MetodoPago;

    /**
     * Información adicional del pago (ej: token de tarjeta, referencia de transferencia)
     */
    @IsOptional()
    informacionPago?: any;
}

/**
 * DTO para filtrar transacciones
 */
export class TransaccionFilterDto {
    /**
     * ID de la solicitud para filtrar transacciones
     */
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt({ message: 'El ID de la solicitud debe ser un número entero' })
    idSolicitud?: number;

    /**
     * Método de pago para filtrar
     */
    @IsOptional()
    @IsEnum(MetodoPago, { message: 'El método de pago debe ser válido' })
    metodoPago?: MetodoPago;

    /**
     * Estado del pago para filtrar
     */
    @IsOptional()
    @IsEnum(EstadoPago, { message: 'El estado del pago debe ser válido' })
    estadoPago?: EstadoPago;

    /**
     * Fecha de inicio para filtrar por rango de fechas
     */
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de inicio debe tener un formato válido' })
    fechaInicio?: string;

    /**
     * Fecha de fin para filtrar por rango de fechas
     */
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de fin debe tener un formato válido' })
    fechaFin?: string;

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
