from pydantic import BaseModel


class LLMRequest(BaseModel):
    session_id: str
    prompt: str
    temperature: float | None = 0.4


class LLMResponse(BaseModel):
    response: str
