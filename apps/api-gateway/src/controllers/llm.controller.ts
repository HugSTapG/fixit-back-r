import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LlmProxyService } from '../proxy/services/llm-proxy.service';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmProxy: LlmProxyService) {}

  @Post('chat')
  @UseGuards(JwtAuthGuard)
  chat(@Body() body: { prompt: string }, @Request() req: any) {
    const sessionId = req.user.idUser.toString();
    return this.llmProxy.chat(sessionId, body.prompt);
  }
}
