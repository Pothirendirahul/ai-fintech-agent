import httpx
from openai import AsyncOpenAI
from config.settings import SERVER_URL
import os

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def run(message: str, history: list) -> str:
    async with httpx.AsyncClient() as http:
        try:
            summary_res = await http.get(f"{SERVER_URL}/api/transactions/stats/summary")
            summary = summary_res.json().get("data", {})
            category_res = await http.get(f"{SERVER_URL}/api/transactions/stats/by-category")
            by_category = category_res.json().get("data", [])
        except Exception:
            summary, by_category = {}, []

    system = f"""You are a Personal Financial Advisor Agent.
User Financial Snapshot:
- Income: ${summary.get('total_income', 0)}
- Expenses: ${summary.get('total_expenses', 0)}
- Net Balance: ${summary.get('net_balance', 0)}
- Spending by Category: {by_category}
Give specific, actionable advice. Use 50/30/20 rule where applicable.
Be encouraging, practical and data-driven."""

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