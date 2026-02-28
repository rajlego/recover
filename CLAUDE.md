# Recover

Recovery companion web app — helps when you feel stuck, overwhelmed, or unsure what to do.

## Tech Stack
- React 19 + TypeScript + Vite 7
- Tailwind CSS 4 + DaisyUI v5 (night theme)
- Zustand for state management
- Google AI Studio (Gemini Flash) primary, OpenRouter fallback

## Domain
- Production: recover.jp.net
- Dev: http://localhost:5173

## Key Architecture
- `src/ai/` — AI service layer with Gemini + OpenRouter streaming
- `src/protocols/` — Structured recovery protocols (decision waffling, overwhelm, Art of Accomplishment, Gendlin's Focusing, time horizon)
- `src/store/` — Zustand stores with localStorage persistence
- `src/components/` — React components (Chat, DiagnosticPanel, Settings, ProtocolPicker)

## Core Concepts
- **Internal Trust Economy** — small credible commitments build trust, big broken promises destroy it
- **Recovery Chat** — the main AI chat that guides through protocols
- **Diagnostic Model** — Dalio-style pattern analyst that reviews session history

## Keyboard Shortcuts
- `Cmd+Shift+,` — Settings
- `Cmd+Shift+D` — Diagnostic Model
- `Enter` — Send message
- `Escape` — Go back to chat

## Future
- Phase 2: Firebase auth (Google) + Yjs sync
- Phase 3: Follow-up check-ins, trust metrics, proactive notifications
- iOS: SwiftUI WKWebView wrapper with TestFlight distribution
