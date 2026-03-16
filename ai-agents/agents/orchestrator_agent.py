from openai import AsyncOpenAI
from agents import analytics_agent, fraud_agent, advisor_agent, market_agent
import os

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

AGENT_MAP = {
    "analytics": analytics_agent,
    "fraud": fraud_agent,
    "advisor": advisor_agent,
    "market": market_agent,
}

async def route(message: str, history: list) -> tuple[str, str]:
    routing_response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": f"""Based on this message, reply with ONLY one word: analytics, fraud, advisor, or market.
- analytics: spending analysis, transaction history, summaries
- fraud: suspicious transactions, fraud detection, flagged items
- advisor: budgeting advice, savings tips, financial goals
- market: currency exchange, conversion, international transfers

Message: "{message}"
Reply with one word only."""
        }],
        max_tokens=10
    )

    agent_name = routing_response.choices[0].message.content.strip().lower()

    if agent_name not in AGENT_MAP:
        agent_name = "analytics"

    agent = AGENT_MAP[agent_name]
    response = await agent.run(message, history)

    return response, agent_name