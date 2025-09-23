import {
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsString,
    IsEnum,
    IsBoolean,
    Length,
    Min
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { TipoNotificacion } from '@app/shared';


/**
 * DTO para crear una notificación
 */
export class CreateNotificacionDto {
    /**
     * ID del usuario que recibirá la notificación
     */
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
    @IsInt({ message: 'El ID del usuario debe ser un número entero' })
    @Min(1, { message: 'El ID del usuario debe ser mayor a 0' })
    idUser: number;

    /**
     * Título de la notificación
     */
    @IsNotEmpty({ message: 'El título es obligatorio' })
    @IsString({ message: 'El título debe ser una cadena de texto' })
    @Length(1, 100, { message: 'El título debe tener entre 1 y 100 caracteres' })
    titulo: string;

    /**
     * Mensaje de la notificación
     */
    @IsNotEmpty({ message: 'El mensaje es obligatorio' })
    @IsString({ message: 'El mensaje debe ser una cadena de texto' })
    @Length(1, 255, { message: 'El mensaje debe tener entre 1 y 255 caracteres' })
    mensaje: string;

    /**
     * Tipo de notificación
     */
    @IsNotEmpty({ message: 'El tipo de notificación es obligatorio' })
    @IsEnum(TipoNotificacion, { message: 'El tipo de notificación debe ser válido' })
    tipoNotificacion: TipoNotificacion;

    /**
     * Estado inicial de lectura (opcional, por defecto false)
     */
    @IsOptional()
    @IsBoolean({ message: 'El estado de lectura debe ser verdadero o falso' })
    estadoLectura?: boolean;
}

/**
 * DTO para actualizar una notificación
 */
export class UpdateNotificacionDto extends PartialType(CreateNotificacionDto) { }

/**
 * DTO para marcar notificaciones como leídas
 */
export class MarcarLeidaDto {
    /**
     * Estado de lectura
     */
    @IsNotEmpty({ message: 'El estado de lectura es obligatorio' })
    @IsBoolean({ message: 'El estado de lectura debe ser verdadero o falso' })
    estadoLectura: boolean;
}

/**
 * DTO para filtrar notificaciones
 */
export class NotificacionFilterDto {
    /**
     * Tipo de notificación para filtrar
     */
    @IsOptional()
    @IsEnum(TipoNotificacion, { message: 'El tipo de notificación debe ser válido' })
    tipoNotificacion?: TipoNotificacion;

    /**
     * Estado de lectura para filtrar
     */
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean({ message: 'El estado de lectura debe ser verdadero o falso' })
    estadoLectura?: boolean;

    /**
     * ID del usuario para filtrar (solo admin)
     */
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt({ message: 'El ID del usuario debe ser un número entero' })
    idUser?: number;

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
