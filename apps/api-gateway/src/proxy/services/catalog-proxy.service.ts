import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MicroserviceProxyService } from './microservice-proxy.service';
import { TECHNICIAN_PATTERNS, GEO_PATTERNS } from '@app/events';

@Injectable()
export class CatalogProxyService extends MicroserviceProxyService {

  getTiposServicios(): Observable<any> {
    return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_ALL_TIPOS_SERVICIOS, {});
  }

  getParroquias(codigoCanton?: string): Observable<any> {
    return this.sendToGeo(GEO_PATTERNS.GET_PARROQUIAS, { codigoCanton });
  }

}
