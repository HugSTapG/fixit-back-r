import type { Canton } from './canton.interface';
import type { Ubicacion } from './ubicacion.interface';

export interface Parroquia {
    codigoParroquia: string;
    codigoCanton: string;
    nombreParroquia: string;
    createdAt: Date;
    updatedAt: Date;
    canton?: Canton;
    ubicaciones?: Ubicacion[];
    _count?: {
        ubicaciones: number;
    };
}
