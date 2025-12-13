import { Module } from '@nestjs/common';
import { LlmController } from '../controllers/llm.controller';
import { LlmProxyService } from '../proxy/services/llm-proxy.service';

@Module({
  controllers: [LlmController],
  providers: [LlmProxyService],
})
export class LlmModule {}
