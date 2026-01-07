# Goal-Based Savings Planner

Production-quality savings planner built with React 18, TypeScript, and Tailwind CSS.

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

#### Use Your Own API Key
1. Get a free API key at [ExchangeRate-API.com](https://www.exchangerate-api.com/)
2. Create a `.env.local` file in the project root:
   ```bash
   cp .env.example .env.local
   ```
3. Add your API key to `.env.local`:
   ```env
   VITE_EXCHANGE_RATE_API_KEY=your-api-key-here
   ```
4. Restart the dev server

### 2. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`