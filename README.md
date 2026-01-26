# Uncertainty Lab - Backend API

A FastAPI backend for computational mathematical finance.

## 🚀 Quick Start

### Local Development

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload --port 8000

# API docs available at:
# http://localhost:8000/docs
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8000` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:5173,...` |

## 🏗️ API Architecture (v2.0)

### Modular Structure

```
/api/v1/
├── data/                    # Data import & generation
│   ├── synthetic           POST  Generate synthetic chain
│   ├── chain               GET   Get current chain
│   ├── csv/detect          POST  Detect CSV columns
│   ├── csv                 POST  Import single CSV
│   ├── csv/multi/detect    POST  Detect multiple CSVs
│   ├── csv/multi           POST  Import multiple CSVs
│   └── reset               POST  Reset state
│
├── volatility/              # IV & Surface
│   ├── iv/compute          POST  Compute IVs
│   ├── surface/fit         POST  Fit vol surface
│   └── surface/grid        POST  Get surface grid
│
├── pricing/                 # Option Pricing
│   ├── european            POST  Black-Scholes
│   ├── exotic/asian        POST  Asian (MC)
│   ├── exotic/barrier      POST  Barrier (MC)
│   └── mc/convergence      POST  MC convergence
│
└── diagnostics/             GET   System state
```

### Backend Module Structure

```
backend/
├── main.py              # FastAPI app, routers
├── shared.py            # Shared state & models
├── routers/
│   ├── __init__.py
│   ├── data.py          # Data import endpoints
│   ├── volatility.py    # IV & surface endpoints
│   ├── pricing.py       # Pricing endpoints
│   └── diagnostics.py   # Diagnostics endpoints
├── pricing_lib/         # Pricing computations
├── vol_surface/         # Surface fitting
└── marketdata/          # CSV import
```

## 📦 Deployment

### Option 1: Railway (Recommended)

Railway offers free tier and easy deployment.

1. **Install Railway CLI**:
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Deploy**:
   ```bash
   cd backend
   railway init
   railway up
   ```

3. **Get URL**:
   ```bash
   railway open
   ```
   Your API will be at: `https://your-project.up.railway.app`

4. **Set environment**:
   ```bash
   railway variables set ALLOWED_ORIGINS="https://angusmit.github.io,https://uncertaintylab.github.io"
   ```

### Option 2: Render

1. **Connect GitHub repo** at [render.com](https://render.com)
2. **Create Web Service** → Select this repo → Set root to `backend`
3. **Configure**:
   - Build: `pip install -r requirements.txt`
   - Start: `gunicorn main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
4. Your API will be at: `https://your-service.onrender.com`

### Option 3: Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Deploy
cd backend
fly launch
fly deploy

# Your API will be at: https://your-app.fly.dev
```

### Option 4: Docker (Any Platform)

```bash
# Build image
docker build -t uncertaintylab-api .

# Run container
docker run -p 8000:8000 \
  -e ALLOWED_ORIGINS="https://angusmit.github.io" \
  uncertaintylab-api
```

## 🔗 Connect Frontend

After deploying, update your frontend:

1. **GitHub Repository Variable**:
   - Go to repo Settings → Secrets and variables → Actions → Variables
   - Add: `VITE_API_URL` = `https://your-backend-url`

2. **Re-deploy frontend** (push to main or trigger workflow)

## 📁 API Structure

```
/                    → API info
/health              → Health check
/docs                → Swagger UI
/redoc               → ReDoc

/chain/synthetic     → Generate synthetic option chain
/chain               → Get current chain
/reset               → Reset state

/import/csv/detect   → Detect CSV columns
/import/csv          → Import single CSV
/import/csv/multi/detect → Detect multiple CSVs
/import/csv/multi    → Import & merge multiple CSVs

/iv/compute          → Compute implied volatilities

/surface/fit         → Fit vol surface
/surface/grid        → Get surface grid data

/price/european      → Black-Scholes pricing
/price/mc/convergence → Monte Carlo convergence

/diagnostics         → Current state diagnostics
```

## 🔒 Security

- CORS restricted to allowed origins
- Request size limited to 10MB
- No authentication (public research API)

## 🧮 Modules

| Module | Description |
|--------|-------------|
| `pricing_lib/` | Black-Scholes, Monte Carlo, Greeks |
| `vol_surface/` | Kernel regression, IV calculation |
| `marketdata/` | CSV import, data cleaning |

## 📄 License

For academic and research purposes only.

---

*Uncertainty Lab - A computational laboratory for mathematical finance*