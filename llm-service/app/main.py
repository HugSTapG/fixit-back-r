from fastapi import FastAPI
from api import router
import uvicorn

app = FastAPI(title="LLM Service")
app.include_router(router, prefix="/llm")


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="info")  # 🔥 CLAVE
