# Uncertainty Lab

A computational laboratory for mathematical finance, volatility surfaces, and uncertainty modelling.

## 🔬 Overview

Uncertainty Lab is a personal research platform for studying:
- Volatility surfaces and implied volatility
- Kernel regression and non-parametric estimation
- Monte Carlo methods and option pricing
- Model risk and calibration
- Arbitrage detection and bounds checking

This is **not** a trading platform or financial advisory tool. It is designed for research, experimentation, and reproducibility.

## 🚀 Quick Start

### Local Development

```bash
# Frontend
cd frontend
npm install
npm run dev
# Open http://localhost:8080

# Backend (in another terminal)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure:
- `VITE_API_URL`: Backend API endpoint (default: `http://localhost:8000`)
- `VITE_BASE_PATH`: Base path for deployment (empty for custom domain)

## 📦 Deployment to GitHub Pages

### Option 1: Using GitHub Actions (Recommended)

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/angusmit/uncertaintylab.git
   git push -u origin main
   ```

2. **Configure GitHub Pages**
   - Go to repo Settings → Pages
   - Set Source to "GitHub Actions"

3. **Automatic Deployment**
   - Push to `main` branch triggers automatic deployment
   - Or manually trigger via Actions tab → Deploy to GitHub Pages → Run workflow

### Option 2: Manual Deployment

```bash
# Build for production
npm run build

# The dist/ folder contains static files to deploy
```

### Domain Options

**Custom Domain (uncertaintylab.github.io):**
- Create organization named `uncertaintylab` on GitHub
- Push to `uncertaintylab.github.io` repo
- No base path needed

**User Repo (angusmit.github.io/uncertaintylab):**
- Set `VITE_BASE_PATH=/uncertaintylab/` in environment
- Push to `uncertaintylab` repo under your account

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/       # UI components
│   │   ├── dashboard/    # Dashboard layout
│   │   ├── ui/          # shadcn components
│   │   └── PendingPage.tsx
│   ├── pages/           # Page components
│   │   ├── About.tsx
│   │   ├── Methods.tsx
│   │   ├── Publications.tsx
│   │   ├── Explore.tsx
│   │   └── app/         # Dashboard pages
│   │       ├── DataImport.tsx
│   │       ├── VolSurface.tsx
│   │       └── Pricer.tsx
│   └── lib/
│       └── api/         # API client & hooks
├── .github/workflows/   # GitHub Actions
├── public/              # Static assets
└── vite.config.ts       # Vite configuration
```

## 🧮 Features

### Data Import
- Single and multi-CSV import
- Flexible column mapping
- Strike suffix parsing (e.g., "62.5C")
- Synthetic bid/ask generation
- No-arbitrage bounds checking

### Volatility Surface
- Nadaraya-Watson kernel regression
- Adjustable bandwidths (hₓ, hᵧ)
- 3D surface visualization
- Smile animations by expiry
- Heatmap view

### Pricing
- Black-Scholes analytical pricing
- Monte Carlo simulation
- Asian and barrier options
- Convergence analysis

## 📖 Pages

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Landing page |
| Explore | `/explore` | Sandbox for experiments |
| Data Import | `/app/data` | CSV import workspace |
| Vol Surface | `/app/surface` | Surface visualization |
| Pricer | `/app/pricer` | Option pricing tools |
| Methods | `/methods` | Scientific methodology |
| Publications | `/publications` | Research papers |
| About | `/about` | Project information |

## 🛠️ Tech Stack

- **React 18** + TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **Plotly.js** + Recharts for visualization
- **React Query** for data fetching
- **Framer Motion** for animations

## 📜 License

This project is for academic and educational purposes only. Not intended for trading or financial advice.

## 👤 Author

**Angus**

---

*Uncertainty Lab - A computational laboratory for mathematical finance.*