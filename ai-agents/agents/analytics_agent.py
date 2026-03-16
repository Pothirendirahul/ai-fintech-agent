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
            summary_res = await http.get(f"{SERVER_URL}/api/transactions/stats/summary")
            summary = summary_res.json().get("data", {})
            category_res = await http.get(f"{SERVER_URL}/api/transactions/stats/by-category")
            by_category = category_res.json().get("data", [])
        except Exception:
            transactions, summary, by_category = [], {}, []

    system = f"""You are an expert Financial Analytics Agent.
Current Financial Summary:
- Total Income: ${summary.get('total_income', 0)}
- Total Expenses: ${summary.get('total_expenses', 0)}
- Net Balance: ${summary.get('net_balance', 0)}
- Total Transactions: {summary.get('total_transactions', 0)}
- Flagged: {summary.get('flagged_count', 0)}
Spending by Category: {by_category}
Recent Transactions: {transactions[:10]}
Answer with specific numbers and insights. Be concise and professional."""

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