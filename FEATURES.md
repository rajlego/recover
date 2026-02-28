# Recover — Feature Tracker

## Implemented (Phase 1)
- [x] Chat with Gemini Flash (streaming, OpenRouter fallback)
- [x] 15 structured protocols (decision waffling, overwhelm, focusing, Art of Accomplishment, JournalSpeak, Locally Optimal, Ways of Looking, Replacing Fear)
- [x] Protocol picker with categories
- [x] Protocol select triggers AI greeting
- [x] Diagnostic Model (Dalio-style pattern analysis)
- [x] Settings with API key management
- [x] Animated starfield theme
- [x] Keyboard navigation (Cmd+Shift+,/D, Escape)
- [x] Playwright e2e tests (15 passing)
- [x] Zustand stores with localStorage persistence
- [x] Time awareness — model has access to current time/date
- [x] Better streaming animation (glow cursor, shimmer on new text, glowing border on active message)
- [x] JournalSpeak / expressive writing protocol (Nicole Sachs + Pennebaker research)
- [x] Chris Lakin "Locally Optimal" unlearning protocol
- [x] fal.ai companion avatar generation (mood-reactive, pixel art style)
- [x] Task dumping with AI categorization (side-by-side transparency view, original line numbers preserved)
- [x] Stardust reward system (points for session completion, streak tracking)
- [x] Rob Burbea "Ways of Looking" protocol (energy body + emptiness lenses + imaginal practice)
- [x] Trust Credit System — living money loan model (micro→small→medium→large loan ladder)
- [x] "Replacing Fear" protocol (Richard Ngo sequence + AnnaSalamon living money)
- [x] Aspirational headline on protocol picker
- [x] AI is trust-credit-aware (calibrates suggestions to user's credit score)
- [x] Codex adversarial review (8 issues found, 6 fixed)
- [x] Deployed to Vercel (recover.jp.net) + GitHub (rajlego/recover)
- [x] Playwright e2e tests (19 passing)

## In Progress / Next

## Queued Features
### Task Management
- [ ] Dump messy task lists → AI categorizes into clean document
- [ ] Show user exactly how tasks are being divided (transparency)
- [ ] Clear indication when tasks are deleted/moved (paranoia-safe)
- [ ] Comparison sorting for priority

### Experiment Tracking
- [ ] Suggest experiments for problems (e.g., "can't get electrolytes")
- [ ] Track which experiments were tried
- [ ] Report back with voice input
- [ ] Build personal evidence base over time
- [ ] Feed data into diagnostic model

### Thinker/Philosophy Integration
- [ ] Import ideas from thinkers via Twitter/writing
- [ ] Synthesize multiple philosophies into experiment suggestions
- [ ] Track which thinkers' approaches work best for user

#### Thinkers to Investigate
- Ray Dalio (Principles methodology) — ACTIVE
- Naval Ravikant
- Michael (Plus3Happiness)
- Chris Lakin (locally optimal, recursive wanting) — ACTIVE (protocol built)
- Rob Burbea (ways of looking, imaginal practice, soulmaking dharma) — ACTIVE (protocol built)
- Joe Hudson / Art of Accomplishment — ACTIVE
- The Buddha / Theravada texts
- Vajrayana texts
- Visakan Veerasamy
- Effortless Mastery (Kenny Werner)
- John Vervaeke
- Nicole Sachs (JournalSpeak) — ACTIVE (protocol built)
- James Pennebaker (expressive writing research) — ACTIVE (integrated into JournalSpeak)
- AnnaSalamon (living money / willpower as loans) — ACTIVE (trust credit system + system prompt)
- Richard Ngo (Replacing Fear sequence) — ACTIVE (protocol built)

### Protocols to Add
- [x] JournalSpeak (20 min expressive writing + 10 min soothing) — DONE
- [x] Chris Lakin "Locally Optimal" unlearning — DONE
- [x] Rob Burbea "Ways of Looking" — DONE
- [x] "Replacing Fear" (trust loans + fear→excitement transition) — DONE
- [ ] Scenario quick-pick menu (fast "I'm having trouble with ___")
- [ ] Vibe coding trap detection (nudge when stuck in one mode too long)

### Reward System
- [ ] Fake currency / points for completing sessions
- [ ] Design so it doesn't undermine intrinsic motivation
- [ ] Maybe tied to experiment tracking

### iOS App
- [ ] SwiftUI WKWebView wrapper loading recover.jp.net
- [ ] Native notifications for check-ins
- [ ] TestFlight distribution for OTA updates

### Auth & Sync (Phase 2)
- [ ] Google sign-in via Firebase Auth
- [ ] Yjs + Firestore sync
- [x] Deploy to recover.jp.net (Vercel)

### Intelligence (Phase 3)
- [ ] Follow-up check-ins with notifications
- [x] Trust economy metrics tracking (credit score + loan history in Settings)
- [ ] Proactive outreach based on patterns
- [ ] Cost tracking for API usage

## Design Notes
- Keep Gemini Flash as primary (cost-conscious)
- Use "kindling" approach — features can be rolled back if not liked
- Data-experiment-driven: suggest experiments, track results, iterate
- User is paranoid about tasks being deleted — always show diffs
