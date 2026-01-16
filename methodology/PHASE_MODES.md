# PHASE: The Five RAMP Modes

The methodology remains constant, but the context determines how RAMP and MVR are executed.

---

## Overview

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

---

## Mode Comparison

| Mode | Primary Actor | Speed | Focus | Best For |
|------|---------------|-------|-------|----------|
| **P** Personal | Individual | Fastest | Intuition | Solo work, trivial decisions |
| **H** Huddle | Team | Fast | Consensus | Sprint planning, architecture |
| **A** Automated | Pipeline | Instant | Compliance | CI/CD gates, deployments |
| **S** Supported | Human + AI | Medium | Augmented | Complex, unfamiliar domains |
| **E** Enterprise | Governance | Slowest | Triage | Regulated, high-stakes pivots |

---

## 👤 Personal Mode ("RAMP Tap")

**Context**: Individual making decisions independently.

**Purpose**: Build reversibility intuition for rapid personal assessment.

### The 3-Second Screen

For quick L1 candidates:
> "If this goes wrong, can I fix it in an hour myself?"
> - **YES** → 🟢 RAMP DOWN (L1/L2)
> - **MAYBE** → Run full MVR
> - **NO** → 🔴 RAMP UP (Escalate)

### Artifacts
- Mental only (L1)
- Commit message tag `[RAMP L2]` for record-keeping

### When to Use
- Personal projects
- Trivial decisions with no stakeholders
- Learning/practicing RAMP methodology

---

## 👥 Huddle Mode ("RAMP Round")

**Context**: Team collectively assessing decisions during ceremonies.

**Purpose**: Build shared reversibility awareness without slowing down.

### The Finger Protocol

1. **Facilitator** reads the decision/ticket
2. **On count of 3**, everyone shows 1-5 fingers (RAMP level)
3. **If fingers differ by >1 level**, 1-minute clarification discussion
4. **Highest (most conservative)** level wins

### Execution

```
Facilitator: "Next item: Add payment retry logic"
Facilitator: "1... 2... 3!"
Team: [shows fingers]
  - Dev 1: 2 fingers (L2)
  - Dev 2: 2 fingers (L2)
  - PM: 3 fingers (L3)
  - Ops: 2 fingers (L2)
Facilitator: "We have a split. PM, what's your concern?"
PM: "Retry logic could cause duplicate charges"
Facilitator: "Good catch. Calling it L3 — we need rollback before shipping."
```

### Artifacts
- Ticket annotations (e.g., `## RAMP: 🟡 L3`)
- Sprint board labels

### When to Use
- Sprint planning
- Backlog refinement
- Architecture decision records
- Incident retrospectives

---

## 🤖 Automated Mode ("RAMP Gate")

**Context**: CI/CD pipelines enforcing RAMP checks automatically.

**Purpose**: Consistent, scalable governance without human bottlenecks.

### Rule-Based Scoring

The pipeline calculates a RAMP score based on detected signals:

| Signal | Score Impact |
|--------|--------------|
| Feature flagged | +20 |
| Rollback script exists | +15 |
| Monitoring configured | +10 |
| Schema change | -30 |
| Breaking change | -40 |
| Data deletion | -50 |

### Gate Logic

```
Score ≥ 70  → ✅ PASS (Normal flow)
Score 50-69 → ⚠️ WARN (Proceed with caution)
Score < 50  → ❌ BLOCK (Human review required)
```

### CLI Usage

```bash
ramp gate "Deploy auth changes" \
  --schema \
  --breaking \
  --flagged \
  --rollback \
  --monitoring \
  --owner "oncall" \
  --strict \    # Exit 1 on BLOCK
  --json        # Machine-readable output
```

### GitHub Actions Example

```yaml
- name: RAMP Gate Check
  run: |
    ramp gate "${{ github.event.pull_request.title }}" \
      --strict --json \
      --schema=$(git diff --name-only | grep -q migrations && echo true || echo false)
```

### When to Use
- CI/CD pipelines
- Deployment automation
- Change management gates
- Compliance enforcement

---

## 🤝 Supported Mode ("RAMP Copilot")

**Context**: AI augments human judgment on complex decisions.

**Purpose**: Leverage AI pattern matching while maintaining human accountability.

### Workflow

1. **Human** describes the decision
2. **AI** identifies:
   - Comparable decisions from library
   - Common irreversibility triggers for this domain
   - Suggested signal thresholds
   - Potential blind spots
3. **Human** validates and adjusts
4. **Human** owns the final assessment

### AI Contributions

| Task | AI Provides | Human Validates |
|------|-------------|-----------------|
| Precedents | "Similar to RAMP Card #47" | "Yes, context matches" |
| Triggers | "Watch for vendor lock-in" | "Good point, adding to plan" |
| Signals | "Suggest error rate > 0.5%" | "Adjusting to 1% for our scale" |
| Blind spots | "Have you considered data residency?" | "Yes, that's handled" |

### Key Principle

> **AI drafts. Human decides.**

The AI accelerates assessment but never bypasses human judgment on reversibility.

### When to Use
- Unfamiliar domains
- Complex multi-factor decisions
- High-stakes where blind spot detection is valuable
- Learning new reversibility patterns

---

## 🏛️ Enterprise Mode ("RAMP Brief")

**Context**: Formal governance for regulated or high-stakes decisions.

**Purpose**: Cross-functional accountability with audit trail.

### Workflow

1. **Initiator** creates RAMP Brief document
2. **Sequential Assessment** by stakeholders:
   - Legal review
   - Finance review
   - Technical review
   - Security review (if applicable)
3. **Sign-off** from RAMP Owner + Executive Sponsor
4. **Archive** with persistent audit trail

### The RAMP Brief

```
╔═══════════════════════════════════════════════════════════════╗
║  RAMP BRIEF                                                   ║
╠═══════════════════════════════════════════════════════════════╣
║  Decision: [title]                                            ║
║  Initiator: [name]      Date: [date]                          ║
║  RAMP Level: [level]    RAMP Score: [score]                   ║
╠═══════════════════════════════════════════════════════════════╣
║  EXECUTIVE SUMMARY                                            ║
║  [Description of decision, context, and stakes]               ║
╠═══════════════════════════════════════════════════════════════╣
║  REVERSIBILITY ASSESSMENT                                     ║
║  [Full 5-question scoring with rationale]                     ║
╠═══════════════════════════════════════════════════════════════╣
║  CONTAINMENT PLAN                                             ║
║  Blast Radius: [scope]                                        ║
║  Rollback Path: [method]                                      ║
║  Kill Signals: [thresholds]                                   ║
║  Irreversibility Triggers: [conditions]                       ║
╠═══════════════════════════════════════════════════════════════╣
║  STAKEHOLDER REVIEWS                                          ║
║  Legal:    [name] [date] [approved/concerns]                  ║
║  Finance:  [name] [date] [approved/concerns]                  ║
║  Tech:     [name] [date] [approved/concerns]                  ║
║  Security: [name] [date] [approved/concerns]                  ║
╠═══════════════════════════════════════════════════════════════╣
║  SIGN-OFF                                                     ║
║  RAMP Owner: [name] [date] [signature]                        ║
║  Exec Sponsor: [name] [date] [signature]                      ║
╚═══════════════════════════════════════════════════════════════╝
```

### When to Use
- L4-L5 decisions
- Regulatory/compliance requirements
- Board-level visibility
- Decisions with existential risk
- Cross-organizational impact

---

## Choosing the Right Mode

```
┌─────────────────────────────────────────────────────────────────┐
│  How to choose PHASE mode                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Is it just you?                                                │
│    YES → 👤 PERSONAL                                            │
│    NO  ↓                                                        │
│                                                                 │
│  Is it a team ceremony?                                         │
│    YES → 👥 HUDDLE                                              │
│    NO  ↓                                                        │
│                                                                 │
│  Is it a deployment/pipeline?                                   │
│    YES → 🤖 AUTOMATED                                           │
│    NO  ↓                                                        │
│                                                                 │
│  Is it complex/unfamiliar?                                      │
│    YES → 🤝 SUPPORTED                                           │
│    NO  ↓                                                        │
│                                                                 │
│  Is it L4-L5 or regulated?                                      │
│    YES → 🏛️ ENTERPRISE                                          │
│    NO  → 👤 PERSONAL (with documentation)                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Mode Configuration

Set your default mode:

```bash
# Set default PHASE mode
ramp config --phase personal
ramp config --phase huddle
ramp config --phase automated
ramp config --phase supported
ramp config --phase enterprise

# Override for single command
ramp mvr "My decision" --mode huddle
```

---

*"Same methodology, right context."* 🚪
