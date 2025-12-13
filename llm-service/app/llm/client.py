import requests
import os

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
MODEL = os.getenv("LLM_MODEL", "MODELNAME")


class LLMClient:
    def __init__(self):
        self.sessions = {}

    def get_session(self, session_id: str):
        if session_id not in self.sessions:
            self.sessions[session_id] = []
        return self.sessions[session_id]

    def chat(self, session_id: str, prompt: str, temperature: float = 0.4):
        history = self.get_session(session_id)

        # Construir prompt con contexto simple
        context = ""
        for msg in history[-10:]:
            context += f"{msg['role']}: {msg['content']}\n"

        full_prompt = f"{context}user: {prompt}\nassistant:"

        payload = {
            "model": MODEL,
            "prompt": full_prompt,
            "temperature": temperature,
            "stream": False,
        }

        res = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json=payload,
            timeout=120,
        )

        res.raise_for_status()

        data = res.json()
        answer = data["response"]

        history.append({"role": "user", "content": prompt})
        history.append({"role": "assistant", "content": answer})

        return answer
