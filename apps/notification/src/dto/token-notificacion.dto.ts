import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsBoolean,
    Length,
    IsDateString
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

/**
 * DTO para registrar un token de notificación push
 */
export class CreateTokenNotificacionDto {
    /**
     * Token del dispositivo para notificaciones push
     */
    @IsNotEmpty({ message: 'El token del dispositivo es obligatorio' })
    @IsString({ message: 'El token debe ser una cadena de texto' })
    @Length(1, 255, { message: 'El token debe tener entre 1 y 255 caracteres' })
    tokenDispositivo: string;

    /**
     * Plataforma del dispositivo (iOS, Android, Web)
     */
    @IsNotEmpty({ message: 'La plataforma es obligatoria' })
    @IsString({ message: 'La plataforma debe ser una cadena de texto' })
    @Length(1, 50, { message: 'La plataforma debe tener entre 1 y 50 caracteres' })
    plataforma: string;

    /**
     * Estado del dispositivo (opcional, por defecto true)
     */
    @IsOptional()
    @IsBoolean({ message: 'El estado del dispositivo debe ser verdadero o falso' })
    estadoDispositivo?: boolean;

    /**
     * Fecha de expiración del token
     */
    @IsNotEmpty({ message: 'La fecha de expiración es obligatoria' })
    @IsDateString({}, { message: 'La fecha de expiración debe tener un formato válido' })
    expiresAt: string;
}

/**
 * DTO para actualizar un token de notificación
 */
export class UpdateTokenNotificacionDto extends PartialType(CreateTokenNotificacionDto) { }

/**
 * DTO para enviar notificación push
 */
export class EnviarNotificacionPushDto {
    /**
     * Título de la notificación push
     */
    @IsNotEmpty({ message: 'El título es obligatorio' })
    @IsString({ message: 'El título debe ser una cadena de texto' })
    @Length(1, 100, { message: 'El título debe tener entre 1 y 100 caracteres' })
    titulo: string;

    /**
     * Mensaje de la notificación push
     */
    @IsNotEmpty({ message: 'El mensaje es obligatorio' })
    @IsString({ message: 'El mensaje debe ser una cadena de texto' })
    @Length(1, 255, { message: 'El mensaje debe tener entre 1 y 255 caracteres' })
    mensaje: string;

    /**
     * Datos adicionales (opcional)
     */
    @IsOptional()
    datosAdicionales?: any;
}
