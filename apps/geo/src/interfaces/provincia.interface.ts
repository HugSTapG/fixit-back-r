import type { Canton } from './canton.interface';

export interface Provincia {
    codigoProvincia: string;
    nombreProvincia: string;
    createdAt: Date;
    updatedAt: Date;
    cantones?: Canton[];
    _count?: {
        cantones: number;
    };
}
