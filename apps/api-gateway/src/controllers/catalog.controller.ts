import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Public } from '@app/shared';
import { CatalogProxyService } from '../proxy/services/catalog-proxy.service';

@Controller('catalogo')
export class CatalogController {
  constructor(private readonly catalogProxyService: CatalogProxyService) { }

  @Get('tipos-servicio')
  @Public()
  getTiposServicios(): Observable<any> {
    return this.catalogProxyService.getTiposServicios();
  }

  @Get('parroquias')
  @Public()
  getParroquias(@Query('codigoCanton') codigoCanton?: string): Observable<any> {
    return this.catalogProxyService.getParroquias(codigoCanton);
  }
}
