# X Poster - AI Daily Content Engine

Generate viral X posts every day using AI trend research, tailored to your voice and niche.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy

**Vercel (recommended):**
```bash
npx vercel
```

**Netlify:**
```bash
npm run build
# drag dist/ folder into Netlify dashboard
```

**Any static host:**
```bash
npm run build
# serve the dist/ folder
```

## Features

- AI post generation with live web search (Claude API)
- 6 viral formats: Hook + List, Contrarian Take, Story Arc, Number + Insight, Then vs Now, Question Hook
- Edit modal to tweak any post before publishing
- Rewrite any post with a fresh angle
- Queue with time scheduling and mark-as-posted
- Posting streak tracking and 35-day heatmap
- Post history with favorites and repost
- Toast notifications for every action
- Keyboard shortcuts: 1 to 5 switch tabs, Ctrl/Cmd+G goes to Generate
- Mobile responsive with bottom navigation

