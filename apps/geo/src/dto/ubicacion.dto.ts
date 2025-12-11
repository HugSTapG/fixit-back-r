import { IsNotEmpty, IsString, IsOptional, Length, IsNumber, Validate, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';

/**
 * Validador personalizado para coordenadas geográficas.
 */
export class CoordinateValidator {
    validate(value: any): boolean {
        if (Array.isArray(value) && value.length === 2) {
            const [longitude, latitude] = value;
            return (
                typeof longitude === 'number' &&
                typeof latitude === 'number' &&
                longitude >= -180 && longitude <= 180 &&
                latitude >= -90 && latitude <= 90
            );
        }
        return false;
    }

    defaultMessage(): string {
        return 'Las coordenadas deben ser un array de [longitud, latitud] dentro de los rangos válidos';
    }
}

/**
 * DTO para la creación de una ubicación.
 */
export class CreateUbicacionDto {
    /**
     * Código de la parroquia a la que pertenece.
     * @example "010101"
     */
    @IsNotEmpty({ message: 'El código de la parroquia es obligatorio' })
    @IsString({ message: 'El código de la parroquia debe ser una cadena de texto' })
    codigoParroquia: string;

    /**
     * Nombre descriptivo de la ubicación.
     * @example "Centro Histórico"
     */
    @IsNotEmpty({ message: 'El nombre de la ubicación es obligatorio' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
    nombreUbicacion: string;

    /**
     * Descripción detallada de la ubicación.
     * @example "Zona céntrica de la ciudad"
     */
    @IsNotEmpty({ message: 'La descripción de la ubicación es obligatoria' })
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @Length(5, 500, { message: 'La descripción debe tener entre 5 y 500 caracteres' })
    descripcionUbicacion: string;

    /**
     * Coordenadas geográficas de la ubicación [longitud, latitud] (opcional).
     * @example [-79.9013, -2.1708]
     */
    @IsOptional()
    @IsArray({ message: 'Las coordenadas deben ser un array' })
    @Validate(CoordinateValidator, { message: 'Las coordenadas deben ser válidas' })
    ubicacion?: [number, number];
}

/**
 * DTO para actualizar una ubicación existente.
 */
export class UpdateUbicacionDto extends PartialType(CreateUbicacionDto) { }

/**
 * DTO para filtrar ubicaciones según diversos criterios.
 */
export class UbicacionFilterDto {
    /**
     * Punto de referencia para búsqueda por proximidad geográfica [longitud, latitud].
     */
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return value; // Let validation handle the error
            }
        }
        return value;
    })
    @IsArray({ message: 'Las coordenadas deben ser un array' })
    @Validate(CoordinateValidator, { message: 'Las coordenadas deben ser válidas' })
    nearbyLocation?: [number, number];

    /**
     * Distancia máxima en metros para búsqueda por proximidad.
     */
    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber({}, { message: 'La distancia máxima debe ser un número' })
    maxDistance?: number;

    /**
     * Código de parroquia para filtrar ubicaciones.
     */
    @IsOptional()
    @IsString({ message: 'El código de parroquia debe ser una cadena de texto' })
    codigoParroquia?: string;
}
