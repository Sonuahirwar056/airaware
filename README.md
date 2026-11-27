# AirAware – Urban Air Quality Assistant

GenAI assistant that helps families navigate winter smog and urban air pollution (Hack2Skill PromptWars, Challenge 6).

- Auto-detects your location and fetches live PM2.5/PM10 from Open-Meteo, converted to an approximate India AQI (CPCB breakpoints)
- Generates a personalised plan: low-emission daily routine, indoor air quality hacks, sustainable swaps, each with an estimated direct impact
- Follow-up Q&A about the plan
- API key stays on the server (`api/plan.js`)

## Deploy on Vercel
1. Push this repo to GitHub.
2. vercel.com → Add New → Project → import the repo.
3. Settings → Environment Variables → add `GEMINI_API_KEY` (free key: https://aistudio.google.com/apikey).
4. Deploy. Open the URL and allow location access.

Run locally: `npx vercel dev` (with a `.env` file based on `.env.example`).

Note: AQI is an estimate from current PM readings; advice is general, not medical.
