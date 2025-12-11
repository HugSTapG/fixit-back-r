import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class NotificationMsController {
  private readonly logger = new Logger(NotificationMsController.name);

  @EventPattern({ cmd: 'request.solicitud.created' })
  async onSolicitudCreated(payload: any) {
    this.logger.log(`Solicitud created event received: ${JSON.stringify(payload)}`);
    // Here you could enqueue a push/email, etc.
  }
}
