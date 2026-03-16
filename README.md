<h1 align="center">💰 AI Fintech Agent</h1>

<p align="center">
  A production-grade AI-powered financial assistant with multi-agent architecture,<br/>
  real-time fraud detection, and intelligent financial insights.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux"/>
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Python-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white"/>
  <img src="https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white"/>
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io"/>
</p>

---

## 🏗️ Architecture

```
React + Redux  ──►  Node.js + Express  ──►  Python FastAPI (AI Agents)
  (Frontend)         (Backend API)          (OpenAI GPT-4o-mini)
                           │
                   SQLite + Redis
```

### Request Flow

```
User Message
    │
    ▼
React (Redux) ──► POST /api/chat
    │
    ▼
Node.js (Redis cache check + rate limit)
    │
    ▼
Python Orchestrator Agent
    │
    ├──► 📊 Analytics Agent    (spending analysis)
    ├──► 🚨 Fraud Agent         (suspicious transactions)
    ├──► 💡 Advisor Agent       (financial advice)
    └──► 💱 Market Agent        (exchange rates)
    │
    ▼
Node.js ──► Socket.io ──► React (real-time response)
    │
    ▼
Fraud detected? ──► Socket.io Alert + Toast Notification
```

---

## 🤖 5 AI Agents

| Agent | Icon | Role | Trigger Keywords |
|---|---|---|---|
| **Orchestrator** | 🧠 | Routes queries to correct specialist | All messages |
| **Analytics** | 📊 | Spending analysis & insights | spending, transactions, summary |
| **Fraud Detection** | 🚨 | Flags suspicious transactions | suspicious, fraud, flagged |
| **Financial Advisor** | 💡 | Budget advice & savings tips | advice, savings, budget, tips |
| **Market** | 💱 | Live exchange rates & currency conversion | exchange, currency, USD, INR |

---

## ✨ Features

- 🤖 **Multi-Agent AI System** — 5 specialized agents powered by OpenAI GPT-4o-mini
- 📊 **Financial Dashboard** — Real-time charts for income, expenses, and trends
- 💳 **Transaction Management** — Full CRUD with category filtering
- 🚨 **Real-time Fraud Alerts** — Instant Socket.io notifications
- ⚡ **Redis Caching** — Fast responses with 5-minute cache TTL
- 🔌 **Split Architecture** — Node.js backend + Python AI layer
- 🐳 **Docker Compose** — One command to run everything

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI Framework |
| Redux Toolkit | State Management |
| Recharts | Financial Charts |
| Socket.io Client | Real-time Updates |
| React Router | Navigation |
| React Hot Toast | Notifications |

### Backend (Node.js)
| Technology | Purpose |
|---|---|
| Express.js | REST API |
| Socket.io | Real-time Events |
| Redis (ioredis) | Caching & Rate Limiting |
| SQLite (better-sqlite3) | Database |
| Nodemailer | Email Alerts |
| PDFKit | Report Generation |

### AI Agent Layer (Python)
| Technology | Purpose |
|---|---|
| FastAPI | Agent API Server |
| OpenAI GPT-4o-mini | AI Model |
| httpx | Async HTTP Calls |
| Pydantic | Data Validation |

### DevOps
| Technology | Purpose |
|---|---|
| Docker Compose | Containerization |
| GitHub Actions | CI/CD Pipeline |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker Desktop
- OpenAI API Key

### 1. Clone the repository
```bash
git clone https://github.com/Pothirendirahul/ai-fintech-agent.git
cd ai-fintech-agent
```

### 2. Set up environment variables

**server/.env**
```env
PORT=5000
NODE_ENV=development
REDIS_HOST=localhost
REDIS_PORT=6379
AI_AGENT_URL=http://localhost:8000
```

**ai-agents/.env**
```env
OPENAI_API_KEY=your_openai_key_here
EXCHANGE_RATE_API_KEY=your_exchange_rate_key_here
SERVER_URL=http://localhost:5000
PORT=8000
```

### 3. Start Redis
```bash
docker run -d --name rd -p 6379:6379 redis:7-alpine
```

### 4. Start Node.js backend
```bash
cd server
npm install
node db/seeds/mockTransactions.js
npm run dev
```

### 5. Start Python AI agents
```bash
cd ai-agents
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 6. Start React frontend
```bash
cd client
npm install
npm start
```

---

## 🌐 Running Services

| Service | URL | Description |
|---|---|---|
| ⚛️ React Frontend | http://localhost:3000 | Dashboard, Chat, Transactions |
| 🟢 Node.js API | http://localhost:5000 | REST API + Socket.io |
| 🐍 Python Agents | http://localhost:8000 | FastAPI AI Agent Layer |
| 📖 Agent API Docs | http://localhost:8000/docs | Swagger UI |
| ⚡ Redis | localhost:6379 | Cache + Rate Limiting |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Send message to AI agent |
| `GET` | `/api/chat/history` | Get chat history |
| `GET` | `/api/transactions` | Get all transactions |
| `POST` | `/api/transactions` | Create transaction |
| `PUT` | `/api/transactions/:id` | Update transaction |
| `DELETE` | `/api/transactions/:id` | Delete transaction |
| `GET` | `/api/transactions/stats/summary` | Financial summary |
| `GET` | `/api/dashboard` | Full dashboard data |

---

## 📁 Project Structure

```
ai-fintech-agent/
├── client/                  # React + Redux Frontend
│   └── src/
│       ├── components/      # Navbar
│       ├── pages/           # Dashboard, Chat, Transactions
│       ├── store/           # Redux slices
│       └── services/        # API + Socket.io
├── server/                  # Node.js Backend
│   ├── routes/              # API routes
│   ├── config/              # Redis, Socket, DB
│   ├── services/            # Agent, Email, PDF
│   └── db/                  # Migrations + Seeds
├── ai-agents/               # Python AI Layer
│   ├── agents/              # 5 specialized agents
│   ├── schemas/             # Pydantic models
│   └── config/              # Settings
└── docker-compose.yml
```

---

<p align="center">Built with ❤️ by <a href="https://github.com/Pothirendirahul">Rahul Pothirendi</a></p>
<p align="center">⭐ Star this repo if you found it helpful!</p>
