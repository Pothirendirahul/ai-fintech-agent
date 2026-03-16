from dotenv import load_dotenv
import os

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
EXCHANGE_RATE_API_KEY = os.getenv("EXCHANGE_RATE_API_KEY")
SERVER_URL = os.getenv("SERVER_URL", "http://localhost:5000")
PORT = int(os.getenv("PORT", 8000))