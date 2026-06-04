# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Harmony Coffee is a React 19 + TypeScript + Vite single-page application for a coffee shop chain with multiple city locations.

## Commands

- `npm run dev` - Start development server with HMR
- `npm run build` - TypeScript type-check then Vite production build
- `npm run lint` - Run ESLint on all files
- `npm run preview` - Preview production build locally

## Architecture

- **Entry point**: `index.html` → `src/main.tsx` → `src/App.tsx`
- **Build output**: `dist/`
- **Static assets**: `public/` (public) and `src/assets/` (bundled)

### Routing

Uses `HashRouter` from react-router-dom (hash-based routing for static hosting compatibility):
- `/` - HomePage
- `/menu` - MenuPage

### Component Organization

```
src/
├── components/
│   ├── common/     # Reusable UI (Button, Logo)
│   ├── layout/     # App shell (Header, Footer)
│   ├── home/       # HomePage sections
│   └── menu/       # MenuPage components
├── context/        # React Context providers
├── data/           # Static data (locations, menu items)
├── hooks/          # Custom hooks
├── pages/          # Route-level components
└── types/          # TypeScript interfaces
```

### Key Libraries

- **react-router-dom**: Client-side routing
- **leaflet + react-leaflet**: Interactive maps for cafe locations
- **motion**: Animations and transitions

## TypeScript Configuration

Strict mode enabled with additional checks:
- `noUnusedLocals` and `noUnusedParameters` enforced
- `noFallthroughCasesInSwitch` and `noUncheckedSideEffectImports` enabled
- Uses bundler module resolution and React JSX transform

## ESLint

Uses flat config format (`eslint.config.js`) with TypeScript, React Hooks, and React Refresh plugins.

## Frontend Aesthetics

Avoid generic "AI slop" design. Create distinctive, creative frontends that surprise and delight.

**Typography**: Choose beautiful, unique fonts. Avoid generic choices (Arial, Inter, Roboto, system fonts, Space Grotesk).

**Color & Theme**: Commit to a cohesive aesthetic using CSS variables. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw inspiration from IDE themes and cultural aesthetics.

**Motion**: Use the Motion library for animations. Focus on high-impact moments—one well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions.

**Backgrounds**: Create atmosphere and depth. Layer CSS gradients, use geometric patterns, or add contextual effects rather than defaulting to solid colors.

**Avoid**: Overused fonts, clichéd purple gradients on white, predictable layouts, cookie-cutter patterns. Vary between light/dark themes and make unexpected choices that feel genuinely designed for the context. 