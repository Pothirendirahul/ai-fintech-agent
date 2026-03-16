import httpx
from openai import AsyncOpenAI
from config.settings import SERVER_URL
import os

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def run(message: str, history: list) -> str:
    async with httpx.AsyncClient() as http:
        try:
            res = await http.get(f"{SERVER_URL}/api/transactions")
            transactions = res.json().get("data", [])
            flagged = [t for t in transactions if t.get("is_flagged")]
        except Exception:
            transactions, flagged = [], []

    system = f"""You are an expert Fraud Detection Agent specialized in financial security.
All Transactions: {transactions}
Already Flagged: {flagged}
Look for: unusual large amounts, duplicate transactions, suspicious categories, structuring patterns.
Provide risk levels: LOW, MEDIUM, HIGH, CRITICAL with transaction IDs when relevant."""

    messages = [{"role": "system", "content": system}]
    for h in history:
        messages.append({"role": h["role"], "content": h["content"]})
    messages.append({"role": "user", "content": message})

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=500
    )
    return response.choices[0].message.content