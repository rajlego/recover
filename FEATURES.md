# Recover — Feature Tracker

## Implemented (Phase 1)
- [x] Chat with Gemini Flash (streaming, OpenRouter fallback)
- [x] 13 structured protocols (decision waffling, overwhelm, focusing, Art of Accomplishment, JournalSpeak, Locally Optimal)
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

## In Progress / Next
- [ ] Task dumping + auto-sorting into categorized document
- [ ] Reward system with fake currency
- [ ] Robberbea mental prompting protocol

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
- Robert Bea (Robberbea)
- Joe Hudson / Art of Accomplishment — ACTIVE
- The Buddha / Theravada texts
- Vajrayana texts
- Visakan Veerasamy
- Effortless Mastery (Kenny Werner)
- John Vervaeke
- Nicole Sachs (JournalSpeak) — ACTIVE (protocol built)
- James Pennebaker (expressive writing research) — ACTIVE (integrated into JournalSpeak)

### Protocols to Add
- [x] JournalSpeak (20 min expressive writing + 10 min soothing) — DONE
- [x] Chris Lakin "Locally Optimal" unlearning — DONE
- [ ] Robberbea mental prompting
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
- [ ] Deploy to recover.jp.net

### Intelligence (Phase 3)
- [ ] Follow-up check-ins with notifications
- [ ] Trust economy metrics tracking
- [ ] Proactive outreach based on patterns
- [ ] Cost tracking for API usage

## Design Notes
- Keep Gemini Flash as primary (cost-conscious)
- Use "kindling" approach — features can be rolled back if not liked
- Data-experiment-driven: suggest experiments, track results, iterate
- User is paranoid about tasks being deleted — always show diffs
