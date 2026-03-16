import httpx
from openai import AsyncOpenAI
from config.settings import EXCHANGE_RATE_API_KEY
import os

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def run(message: str, history: list) -> str:
    rates = {}
    try:
        async with httpx.AsyncClient() as http:
            res = await http.get(
                f"https://v6.exchangerate-api.com/v6/{EXCHANGE_RATE_API_KEY}/latest/USD"
            )
            all_rates = res.json().get("conversion_rates", {})
            currencies = ["EUR", "GBP", "INR", "JPY", "CAD", "AUD", "CHF", "CNY", "SGD"]
            rates = {k: all_rates[k] for k in currencies if k in all_rates}
    except Exception as e:
        rates = {"error": str(e)}

    system = f"""You are a Market Intelligence Agent specialized in currency exchange.
Current USD Exchange Rates: {rates}
Help with currency conversions, exchange rate comparisons, travel money advice.
Always show calculations clearly."""

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