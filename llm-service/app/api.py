from fastapi import APIRouter
from schemas import LLMRequest, LLMResponse
from llm.client import LLMClient

router = APIRouter()
client = LLMClient()


@router.post("/chat", response_model=LLMResponse)
def chat(req: LLMRequest):
    response = client.chat(
        session_id=req.session_id, prompt=req.prompt, temperature=req.temperature
    )
    return {"response": response}
