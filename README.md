# El Paso Hub (eptruth)

## What this website is

**El Paso Hub** is a public information and advocacy site for people in El Paso who care how large-scale data centers and related policy affect the region. It explains topics in plain language: environmental and infrastructure impacts, local government and meetings, how to take part (pledge, contribute tips), and where reporting comes from.

The site includes sections such as a **home** overview, **learn** basics, a **data centers** area with structured impacts content and citations, **local government** contacts and process, **news** and **city meetings**, a community **pledge**, and a **contribute** path for tips. Copy and many data files live in JSON under `content/` and `dictionaries/` so pages can stay consistent and easier to update than hardcoding long text in components.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended; a current 20.x or newer runtime is a good match)

## Setup and local development

Install dependencies from the project root:

```bash
npm install
```

Start the development server (Turbopack):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production build

```bash
npm run build
npm start
```

## Other scripts

| Command | Purpose |
| -------- | -------- |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm test` | Vitest (unit tests) |
| `npm run feed-health` | Feed health check script |

## Important libraries

These are the main runtime dependencies from `package.json`:

| Library | Role |
| -------- | ------ |
| [Next.js](https://nextjs.org/) | App Router, routing, RSC, `next/font`, production build |
| [React](https://react.dev/) | UI and hooks |
| [@mui/material](https://mui.com/material-ui/) | Layout, typography, forms, theming (CSS variables) |
| [@mui/icons-material](https://mui.com/material-ui/material-icons/) | Icon set used in the UI |
| [@mui/material-nextjs](https://mui.com/material-ui/integrations/nextjs/) | Emotion cache and App Router integration for MUI |
| [@emotion/react](https://emotion.sh/docs/introduction) & [@emotion/styled](https://emotion.sh/docs/styled) | Styling layer used by MUI |
| [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser) | XML parsing for feeds and related scripts |

**Development:** TypeScript, ESLint (`eslint-config-next`), Vitest.
