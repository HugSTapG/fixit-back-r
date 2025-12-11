import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MicroserviceProxyService } from './microservice-proxy.service';
import { GEO_PATTERNS } from '@app/events';

@Injectable()
export class GeoProxyService extends MicroserviceProxyService {

    // Provincias
    getProvincias(): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.GET_PROVINCIAS, {});
    }

    getProvincia(codigoProvincia: string): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.GET_PROVINCIA, { codigoProvincia });
    }

    createProvincia(createProvinciaDto: any): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.CREATE_PROVINCIA, createProvinciaDto);
    }

    updateProvincia(codigoProvincia: string, updateProvinciaDto: any): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.UPDATE_PROVINCIA, { codigoProvincia, ...updateProvinciaDto });
    }

    deleteProvincia(codigoProvincia: string): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.DELETE_PROVINCIA, { codigoProvincia });
    }

    // Cantones
    getCantones(codigoProvincia?: string): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.GET_CANTONES, { codigoProvincia });
    }

    getCanton(codigoCanton: string): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.GET_CANTON, { codigoCanton });
    }

    createCanton(createCantonDto: any): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.CREATE_CANTON, createCantonDto);
    }

    updateCanton(codigoCanton: string, updateCantonDto: any): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.UPDATE_CANTON, { codigoCanton, ...updateCantonDto });
    }

    deleteCanton(codigoCanton: string): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.DELETE_CANTON, { codigoCanton });
    }

    // Parroquias
    getParroquias(codigoCanton?: string): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.GET_PARROQUIAS, { codigoCanton });
    }

    getParroquia(codigoParroquia: string): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.GET_PARROQUIA, { codigoParroquia });
    }

    createParroquia(createParroquiaDto: any): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.CREATE_PARROQUIA, createParroquiaDto);
    }

    updateParroquia(codigoParroquia: string, updateParroquiaDto: any): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.UPDATE_PARROQUIA, { codigoParroquia, ...updateParroquiaDto });
    }

    deleteParroquia(codigoParroquia: string): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.DELETE_PARROQUIA, { codigoParroquia });
    }

    // Ubicaciones
    getUbicaciones(filters: any): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.GET_UBICACIONES, filters);
    }

    getUbicacion(idUbicacion: number): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.GET_UBICACION, { idUbicacion });
    }

    getUbicacionesByParroquia(codigoParroquia: string): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.GET_UBICACIONES_BY_PARROQUIA, { codigoParroquia });
    }

    createUbicacion(createUbicacionDto: any): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.CREATE_UBICACION, createUbicacionDto);
    }

    updateUbicacion(idUbicacion: number, updateUbicacionDto: any): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.UPDATE_UBICACION, { idUbicacion, ...updateUbicacionDto });
    }

    deleteUbicacion(idUbicacion: number): Observable<any> {
        return this.sendToGeo(GEO_PATTERNS.DELETE_UBICACION, { idUbicacion });
    }
}
