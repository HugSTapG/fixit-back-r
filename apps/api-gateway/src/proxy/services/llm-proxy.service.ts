import { Injectable } from '@nestjs/common';

@Injectable()
export class LlmProxyService {
  private readonly baseUrl = process.env.LLM_SERVICE_URL!;

  async chat(sessionId: string, prompt: string) {
    const res = await fetch(`${this.baseUrl}/llm/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        prompt,
      }),
    });

    if (!res.ok) {
      throw new Error(`LLM service error: ${res.statusText}`);
    }

    return res.json();
  }
}
