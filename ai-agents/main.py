from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas.chat_schema import ChatRequest, ChatResponse
from agents.orchestrator_agent import route
from config.settings import PORT

app = FastAPI(title="AI Fintech Agents", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "✅ AI Agents Running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        response, agent_used = await route(req.message, [h.dict() for h in req.history])
        return ChatResponse(success=True, response=response, agent_used=agent_used)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))