import type { Provincia } from './provincia.interface';
import type { Parroquia } from './parroquia.interface';

export interface Canton {
    codigoCanton: string;
    codigoProvincia: string;
    nombreCanton: string;
    createdAt: Date;
    updatedAt: Date;
    provincia?: Provincia;
    parroquias?: Parroquia[];
    _count?: {
        parroquias: number;
    };
}
