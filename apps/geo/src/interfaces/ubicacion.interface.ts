import type { Parroquia } from './parroquia.interface';

export interface UbicacionGeometry {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
}

export interface Ubicacion {
    idUbicacion: number;
    codigoParroquia: string;
    nombreUbicacion: string;
    descripcionUbicacion: string;
    ubicacion?: UbicacionGeometry | null;
    createdAt: Date;
    updatedAt: Date;
    parroquia?: Parroquia;
    distanceMeters?: number | null; // Para consultas espaciales
}

export interface CreateUbicacionData {
    codigoParroquia: string;
    nombreUbicacion: string;
    descripcionUbicacion: string;
    ubicacion?: [number, number]; // [longitude, latitude]
}

export interface UpdateUbicacionData {
    codigoParroquia?: string;
    nombreUbicacion?: string;
    descripcionUbicacion?: string;
    ubicacion?: [number, number]; // [longitude, latitude]
}
