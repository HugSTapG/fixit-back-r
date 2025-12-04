import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TiposServiciosService } from './services/tipos-servicios.service';

@Controller()
export class TechnicianMsController {
  constructor(private readonly tiposServiciosService: TiposServiciosService) {}

  // Validate that a tipo de servicio exists (returns boolean)
  @MessagePattern({ cmd: 'technician.tipo-servicio.validate' })
  async validateTipoServicio(payload: { idTipoServicio: number }): Promise<boolean> {
    const { idTipoServicio } = payload || {} as any;
    if (!idTipoServicio || typeof idTipoServicio !== 'number') return false;
    try {
      await this.tiposServiciosService.findOne(idTipoServicio);
      return true;
    } catch {
      return false;
    }
  }
}
