import { SubServicio } from '@app/shared';

export interface TipoServicio {
    idTipoServicio: number;
    nombreServicio: string;
    descripcionServicio: string;
    subServicio: SubServicio;
    createdAt: Date;
    updatedAt: Date;
}

export interface TipoServicioWithDetails extends TipoServicio {
    tecnicosServicios?: any[];
    solicitudes?: any[];
    _count?: {
        tecnicosServicios: number;
        solicitudes: number;
    };
}