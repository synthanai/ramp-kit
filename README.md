<p align="center">
  <img src="ramp_logo.png" alt="RAMP" width="200">
</p>

<h1 align="center">RAMP-Kit</h1>

<p align="center">
  <strong>Reversible Action Management Protocol</strong><br>
  <em>A methodology for governing decision velocity based on reversibility.</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/rampkit"><img src="https://img.shields.io/npm/v/rampkit.svg" alt="npm"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <a href="https://synthanai.github.io/ramp-kit"><img src="https://img.shields.io/badge/playground-live-orange.svg" alt="Try Now"></a>
  <img src="https://img.shields.io/badge/tests-100%2B%20passing-brightgreen.svg" alt="Tests">
</p>

<p align="center">
  <strong>"Can we undo this?"</strong><br>
  <em>Move fast on two-way doors. Slow down on one-way doors.</em>
</p>

---

## What is RAMP?

**RAMP** is a decision governance methodology that uses **reversibility** as the primary driver of process weight. Based on Jeff Bezos's "one-way door" (Type 1) and "two-way door" (Type 2) decision framework, RAMP provides a systematic approach to increasing decision velocity without increasing risk.

| Letter | Meaning | Definition |
|--------|---------|------------|
| **R** | Reversible | Actions that can be undone within a known timeframe |
| **A** | Action | Specific, scoped decisions with clear accountability |
| **M** | Management | Systematic governance scaled to consequence level |
| **P** | Protocol | Structured process with explicit checkpoints |

---

## The Problem

**Don't ship blind.**

Organizations face a consistent failure mode: they apply **uniform process weight** to all decisions:

| Failure Mode | The Result |
|--------------|------------|
| **Excessive rigor on reversible decisions** | Velocity death. Teams paralyzed by approval chains for feature flags. |
| **Insufficient rigor on irreversible decisions** | Preventable disasters. Schema migrations ship without rollback plans. |
| **Implicit reversibility assumptions** | "We can always roll back" → Famous last words. |
| **No containment awareness** | "It only affects one module" → It never only affects one module. |

The cost of reversible mistakes is **delay**. The cost of irreversible mistakes is **existential**.

**RAMP ensures process weight matches consequence severity.**

## The Solution

RAMP creates **proportional governance** by explicitly classifying decisions by reversibility, then matching controls to consequences:

> *"RAMP DOWN on two-way doors. RAMP UP on one-way doors."*  
> *"Can we undo this?"*

---

## Installation

### CLI
```bash
npm install -g rampkit
```

### Web (No Install)
**[▶️ synthanai.github.io/ramp-kit](https://synthanai.github.io/ramp-kit)**

---

## Usage

```bash
# ⚡ Quick MVR (15-minute rapid assessment)
ramp mvr "Migrate database to PostgreSQL"

# 🚀 Quick 3-second screen
ramp quick "Enable dark mode flag"

# 👥 Huddle Round (team assessment)
ramp huddle

# 🤖 CI/CD Gate (pipeline integration)
ramp gate "Deploy auth changes" --strict --json

# 📊 Full RAMPKIT protocol
ramp start "Platform migration"

# 📜 Show methodology reference
ramp ref
```

---

## 📚 Core Concepts

### RAMP Levels (L1-L5)

RAMP classifies decisions into five levels based on reversal time:

```
⚡ L1 — INSTANT      (<1 hour)   → Ship it
🔄 L2 — RAPID        (<1 day)    → Monitor & Ship
📋 L3 — PLANNED      (<1 week)   → Plan rollback first
⚠️ L4 — EFFORTFUL    (<1 month)  → Require approval
🚫 L5 — IRREVERSIBLE (Permanent) → Full RAMP UP
```

| Level | Name | Reversal Time | Typical Examples | Action |
|-------|------|---------------|------------------|--------|
| **L1** | Instant | <1 hour | Feature flags, config toggles | Ship it |
| **L2** | Rapid | <1 day | Code rollback, backward-compatible schema | Monitor |
| **L3** | Planned | <1 week | Data migration, dual-system cutover | Plan first |
| **L4** | Effortful | <1 month | Significant rework, partial data loss | Approval |
| **L5** | Irreversible | Permanent | Trust loss, data gone, existential cost | Full RAMP UP |

📖 **[Full RAMP Levels →](methodology/LEVELS.md)**

---

### The RAMPKIT Protocol (7 Steps)

The complete operational protocol for governing decisions:

```
R ─── RECOGNIZE ─── "What are we doing?"
      │
A ─── ASSESS ────── "How reversible is it?"
      │
M ─── MAP ──────── "What's the containment plan?"
      │
P ─── POSITION ─── "RAMP UP or RAMP DOWN?"
      │
K ─── KICKOFF ──── "Who owns this?"
      │
I ─── INSPECT ──── "Are signals nominal?"
      │
T ─── TRACK ────── "What did we learn?"
```

| Step | Phase | Key Question | Output |
|------|-------|--------------|--------|
| **R** | Recognize | "What are we doing?" | Decision statement |
| **A** | Assess | "How reversible is it?" | RAMP Score (0-100) |
| **M** | Map | "What's the containment plan?" | Rollback plan & Signals |
| **P** | Position | "RAMP UP or RAMP DOWN?" | Direction decision |
| **K** | Kickoff | "Who owns this?" | RAMP Card |
| **I** | Inspect | "Are signals nominal?" | Checkpoint reviews |
| **T** | Track | "What did we learn?" | Decision record |

📖 **[Full RAMPKIT Protocol →](methodology/PROTOCOL.md)**

---

### MVR: Minimum Viable RAMP (15-Minute Protocol)

For time-constrained decisions, a rapid 4-step protocol delivering 80% of insight in 20% of time:

| Step | Time | Question |
|------|------|----------|
| **R** | 2 min | "What are we shipping?" |
| **A** | 5 min | "How reversible is it?" |
| **M** | 5 min | "What if it fails?" |
| **P** | 3 min | "Ship or stop?" |

**Traffic Light Decision:**
- 🟢 **GREEN (L1-L2)**: RAMP DOWN — Ship it now
- 🟡 **YELLOW (L3)**: RAMP CAREFULLY — Ship with monitoring
- 🔴 **RED (L4-L5)**: RAMP UP — Stop and escalate

📖 **[Full MVR Protocol →](methodology/MVR_PROTOCOL.md)**

---

### The DOORS Principles

Five epistemological stances for practitioners. Check the DOORS before you walk through:

| Principle | Stance |
|-----------|--------|
| **D**eclare | State reversibility explicitly before acting |
| **O**bserve | Watch for irreversibility triggers before they close the door |
| **O**wn | Assign accountability for the rollback path |
| **R**eady | Prepare the rollback before committing forward |
| **S**ignal | Define observable indicators that trigger reversal |

**The 30-Second DOORS Check:**
> "This is a **[door type]**. If **[trigger]** happens, **[owner]** will **[rollback action]** when we see **[signal]**."

📖 **[Full DOORS Principles →](methodology/DOORS_PRINCIPLES.md)**

---

### The PHASE Framework (5 Modes)

**PHASE** defines five operational contexts for running RAMP:

```
┌───────────────────────────────────────────────────────────────────────┐
│                          P H A S E                                    │
├───────────────────────────────────────────────────────────────────────┤
│ 👤 P — PERSONAL     Individual builds reversibility intuition        │
│ 👥 H — HUDDLE       Team collectively assesses (Finger Protocol)     │
│ 🤖 A — AUTOMATED    Pipeline enforces RAMP checks in CI/CD           │
│ 🤝 S — SUPPORTED    AI augments human judgment                       │
│ 🏛️ E — ENTERPRISE   Formal governance for high-stakes decisions      │
└───────────────────────────────────────────────────────────────────────┘
```

| Mode | Who | Speed | Expression |
|------|-----|-------|------------|
| **Personal** | Individual | Fastest | "RAMP Tap" — 3-second screen |
| **Huddle** | Team | Fast | "RAMP Round" — Finger Protocol |
| **Automated** | Pipeline | Instant | "RAMP Gate" — CI/CD integration |
| **Supported** | Human + AI | Medium | "RAMP Copilot" — AI suggestion validation |
| **Enterprise** | Governance | Slowest | "RAMP Brief" — Cross-functional sign-off |

📖 **[Full PHASE Framework →](methodology/PHASE_MODES.md)**

---

### The Four Laws of RAMP

The foundational physics of reversibility:

1. **Law of Reversibility**: Every action must declare its nature — Reversible, Costly to Reverse, or Irreversible.

2. **Law of Proportional Autonomy**: Autonomy scales with reversibility. More reversible = more autonomy.

3. **Law of Momentum Interrupts**: Auto-insert pauses when confidence spikes or scope expands.

4. **Law of Containment**: Every action declares blast radius, rollback path, and observable signals.

📖 **[Full Four Laws →](methodology/FOUR_LAWS.md)**

---

### The RAMP Manifesto

**Four Values:**
1. **REVERSIBILITY over RIGIDITY**: Design for undo over design for perfection.
2. **PROPORTIONAL PROCESS over UNIFORM PROCEDURE**: Match controls to consequences.
3. **MOMENTUM WITH CHECKPOINTS over APPROVAL BOTTLENECKS**: Pauses for awareness, not gates for permission.
4. **OBSERVABLE CONTAINMENT over ASSUMED SAFETY**: Blast radius awareness over optimistic deployment.

📖 **[Full RAMP Manifesto →](methodology/MANIFESTO.md)**

---

## Commands

### Core Commands
| Command | Description |
|---------|-------------|
| `ramp mvr [topic]` | ⚡ MVR: 15-minute rapid assessment |
| `ramp quick [topic]` | Quick 3-second screen |
| `ramp start [topic]` | Full RAMPKIT 7-step protocol |
| `ramp huddle` | 👥 Team RAMP Round |
| `ramp gate [topic]` | 🤖 CI/CD pipeline gate |

### Reference Commands
| Command | Description |
|---------|-------------|
| `ramp ref` | Quick reference card |
| `ramp levels` | Show RAMP levels |
| `ramp protocol` | Show RAMPKIT protocol |
| `ramp doors` | Show DOORS principles |
| `ramp phase` | Show PHASE modes |
| `ramp climbs` | Show CLIMBS patterns |

### History & Config
| Command | Description |
|---------|-------------|
| `ramp history` | View past decisions |
| `ramp status` | Show version & stats |
| `ramp config` | View/set configuration |
| `ramp config --phase <mode>` | Set PHASE mode |

---

## RAMP Score Assessment

The RAMP Score (0-100) quantifies reversibility through five questions:

| # | Question | Max Score |
|---|----------|-----------|
| 1 | Can we undo this within 24 hours? | +30 |
| 2 | Is this additive (not destructive)? | +25 |
| 3 | Can we limit who/what is affected? | +20 |
| 4 | Do we know how to rollback? | +15 |
| 5 | Will we detect problems quickly? | +10 |

**Score to Level Mapping:**
- **90-100**: L1 (Instant)
- **70-89**: L2 (Rapid)
- **50-69**: L3 (Planned)
- **30-49**: L4 (Effortful)
- **0-29**: L5 (Irreversible)

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/ramp-gate.yml
name: RAMP Gate
on: [pull_request]

jobs:
  ramp-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install -g rampkit
      - name: RAMP Gate Check
        run: |
          ramp gate "${{ github.event.pull_request.title }}" \
            --strict --json \
            --schema=$(git diff --name-only | grep -q migrations && echo true || echo false) \
            --breaking=$(git log -1 --pretty=%B | grep -qiE 'breaking|major' && echo true || echo false)
```

### Pipeline Flags

```bash
ramp gate "Deploy auth changes" \
  --schema           # Schema change detected (+30 penalty)
  --breaking         # Breaking change (+40 penalty)
  --flagged          # Feature flagged (+20 bonus)
  --rollback         # Rollback script exists (+15 bonus)
  --monitoring       # Monitoring configured (+10 bonus)
  --owner "oncall"   # Rollback owner
  --strict           # Exit 1 on BLOCK
  --json             # JSON output
```

---

## Configuration

**Global config:** `~/.ramp/`

```
~/.ramp/
├── config.json     # PHASE mode & settings
├── decisions/      # Decision history
└── cards/          # RAMP cards
```

---

## 📖 Methodology Documentation

### Philosophy & Foundations

| Document | Description |
|----------|-------------|
| [**MANIFESTO.md**](methodology/MANIFESTO.md) | The complete philosophy of RAMP |
| [**FOUR_LAWS.md**](methodology/FOUR_LAWS.md) | The foundational physics of reversibility |
| [**DOORS_PRINCIPLES.md**](methodology/DOORS_PRINCIPLES.md) | The 5 epistemological stances |

### Process & Practice

| Document | Description |
|----------|-------------|
| [**PROTOCOL.md**](methodology/PROTOCOL.md) | The 7-step RAMPKIT protocol |
| [**MVR_PROTOCOL.md**](methodology/MVR_PROTOCOL.md) | The 15-minute rapid assessment |
| [**PHASE_MODES.md**](methodology/PHASE_MODES.md) | The 5 operational contexts |
| [**LEVELS.md**](methodology/LEVELS.md) | RAMP Levels L1-L5 |
| [**CLIMBS.md**](methodology/CLIMBS.md) | 6 advanced patterns |

### Quick Start

| Document | Description |
|----------|-------------|
| [**RAMP_CHEATSHEET.md**](methodology/RAMP_CHEATSHEET.md) | Learn RAMP in 60 seconds |
| [**RAMP_IN_5_MINUTES.md**](methodology/RAMP_IN_5_MINUTES.md) | Learn to run RAMP in 5 minutes |

### Resources

| Document | Description |
|----------|-------------|
| [**CARD_LIBRARY.md**](methodology/CARD_LIBRARY.md) | 108 RAMP card templates |
| [**VECTOR_CONFIG.md**](methodology/VECTOR_CONFIG.md) | Multi-dimensional configuration |

---

## Integration with SPAR

RAMP completes the decision lifecycle when paired with [SPAR](https://github.com/synthanai/spar-kit):

| Phase | Framework | Question | Time |
|-------|-----------|----------|------|
| **Deliberation** | SPAR (MVS) | "What should we do?" | 30 min |
| **Governance** | RAMP (MVR) | "How safe is it to deliver?" | 15 min |

> **"Deliberate to decide. RAMP IT UP to deliver."**

The **45-minute Mini Decision Lifecycle**:
1. **MVS** (30 min) → Structured disagreement → Decision
2. **MVR** (15 min) → Reversibility assessment → Safe delivery

---

## Security

- Decision history stored locally in `~/.ramp/`
- No external data transmission
- Config file permissions checked on startup

---

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## Development

```bash
git clone https://github.com/synthanai/ramp-kit.git
cd ramp-kit
npm install
npm test
node src/index.js
```

---

## 🤝 Contributing

RAMP is a living methodology that grows through use. Contributions welcome:

- **📦 New RAMP Cards** — Submit templates for uncovered decision types
- **📝 Case Studies** — Document RAMP assessments you've run
- **📖 Methodology Refinements** — Propose improvements to core concepts
- **🌍 Translations** — Help RAMP speak new languages

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for guidelines.

---

## 🧭 The Deeper Pattern

RAMP isn't just a governance framework. It's a stance toward action:

> *Not all decisions deserve equal weight.*
>
> *Reversibility determines required rigor.*
>
> *Speed is valuable; recklessness is not.*
>
> *The best teams move fast on two-way doors and slow down on one-way doors.*

---

## The 9x Principle

RAMP promises compounding benefit through Trinity integration:

- **3x Safer**: Human judgment + Machine verification + Agent guardrails
- **3x Smarter**: Human wisdom + Machine data + Agent synthesis  
- **3x Faster**: Human delegation + Machine automation + Agent parallelism

---

## 🆓 OSS vs 💎 Platform

**RAMP-Kit is the open protocol. ARANGAM is the premium platform.**

| What You Get | RAMP-Kit (OSS) | ARANGAM Platform |
|--------------|----------------|------------------|
| RAMPKIT Protocol | ✅ Full 7-step process | ✅ |
| L1-L5 Levels + DOORS | ✅ | ✅ |
| CLI + Web Playground | ✅ | ✅ |
| **Hosted Decision Ledger** | ❌ | ✅ MOMENT tracking |
| **Team Governance** | ❌ | ✅ Approvals + workflows |
| **RAMP Enforcement Engine** | ❌ | ✅ Automated gates |
| **Enterprise SSO + Retention** | ❌ | ✅ |
| **Priority Support** | ❌ | ✅ |

> **The protocol is free. The enforcement is premium.**

See [ATTRIBUTION.md](ATTRIBUTION.md) for attribution guidelines.

---

## Links

- **[Web Playground](https://synthanai.github.io/ramp-kit)** — Try in browser
- **[npm Package](https://www.npmjs.com/package/rampkit)** — Install via npm
- **[SPAR-Kit](https://github.com/synthanai/spar-kit)** — Sister methodology for deliberation
- **[RAMPKIT Protocol](methodology/PROTOCOL.md)** — 7-step methodology
- **[Full Manifesto](methodology/MANIFESTO.md)** — Complete philosophy

---

## License

MIT © [Naveen Riaz Mohamed Kani](https://github.com/synthanai)

---

<p align="center">
  <strong>"Can we undo this?"</strong><br>
  <em>Move fast on two-way doors. Slow down on one-way doors.</em> 🚪
</p>
