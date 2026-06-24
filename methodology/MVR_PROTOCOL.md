# MVR: Minimum Viable RAMP

The 15-minute rapid reversibility assessment protocol.

---

## Overview

MVR (Minimum Viable RAMP) delivers **80% of reversibility insight in 20% of the time**. It's the rapid version of the full RAMPKIT protocol, using only the first 4 steps.

**Use MVR when**:
- Time-constrained decisions
- L1-L3 level actions (score > 50)
- Sprint planning ceremonies
- Quick reversibility checks

**Use full RAMPKIT when**:
- L4-L5 level actions (score < 50)
- High-stakes irreversible decisions
- Audit/compliance requirements
- Complex multi-phase initiatives

---

## The 4 Steps

```
R ─── RECOGNIZE ─── (2 min) "What are we shipping?"
      │
A ─── ASSESS ────── (5 min) "How reversible is it?"
      │
M ─── MAP ──────── (5 min) "What if it fails?"
      │
P ─── POSITION ─── (3 min) "Ship or stop?"
```

| Step | Time | Key Question | Output |
|------|------|--------------|--------|
| **R** | 2 min | "What are we shipping?" | Decision statement |
| **A** | 5 min | "How reversible is it?" | RAMP Score |
| **M** | 5 min | "What if it fails?" | Rollback owner + method |
| **P** | 3 min | "Ship or stop?" | Traffic light decision |

---

## Step 1: RECOGNIZE (2 minutes)

**Question**: "What are we shipping?"

**Gather**:
- **Action**: What specifically are you doing?
- **Scope**: Who/what is affected?
- **Timeline**: When is this starting?

**Template**:
```
We are [ACTION] affecting [SCOPE] starting [WHEN].
```

**Example**:
> We are enabling the new payment flow affecting 10% of users starting tomorrow.

---

## Step 2: ASSESS (5 minutes)

**Question**: "How reversible is it?"

### The Lightning Round (5 questions, 1 minute each)

| # | Question | Score |
|---|----------|-------|
| 1 | Can we undo this within 24 hours? | +30 / +15 / 0 |
| 2 | Is this additive (not destructive)? | +25 / +15 / 0 |
| 3 | Can we limit the blast radius? | +20 / +10 / 0 |
| 4 | Do we have a known rollback method? | +15 / +10 / 0 |
| 5 | Will we detect problems quickly? | +10 / +5 / 0 |

**Scoring Guide**:
- **High**: Full points (+30/+25/+20/+15/+10)
- **Medium**: Partial points (+15/+15/+10/+10/+5)
- **Low**: Zero points (0)

**Calculate total and determine level**:
- 90-100: L1 (Instant) ⚡
- 70-89: L2 (Rapid) 🔄
- 50-69: L3 (Planned) 📋
- 30-49: L4 (Effortful) ⚠️
- 0-29: L5 (Irreversible) 🚫

---

## Step 3: MAP (5 minutes)

**Question**: "What if it fails?"

**Minimum Viable Containment**:

1. **Rollback Owner**: Who fixes this if it breaks?
   > Name a specific person with authority and capability.

2. **Rollback Method**: How do we undo this?
   > Feature flag off / Code revert / Database restore / Manual cleanup

3. **Kill Signal**: What tells us to stop? (L3+ only)
   > "Error rate > 1%" / "Latency > 500ms" / "Customer complaints > 5"

**Template**:
```
If this fails:
- OWNER: [name] will
- METHOD: [do what] when we see
- SIGNAL: [metric > threshold]
```

**Example**:
> If this fails, Sarah will turn off the feature flag when error rate exceeds 1%.

---

## Step 4: POSITION (3 minutes)

**Question**: "Ship or stop?"

### The Traffic Light Decision

| Signal | Level | Action | Meaning |
|--------|-------|--------|---------|
| 🟢 **GREEN** | L1-L2 | RAMP DOWN | Ship it now |
| 🟡 **YELLOW** | L3 | RAMP CAREFULLY | Ship with monitoring |
| 🔴 **RED** | L4-L5 | RAMP UP | Stop and escalate |

**Decision Tree**:

```
Score ≥ 70?
  YES → 🟢 GREEN: Ship it
  NO  → Score ≥ 50?
          YES → 🟡 YELLOW: Ship with checkpoints
          NO  → 🔴 RED: Stop, run full RAMPKIT
```

---

## Output Template

```
╔═══════════════════════════════════════════════════════════════╗
║  ⚡ MVR RESULT                                                 ║
╠═══════════════════════════════════════════════════════════════╣
║  Decision: [statement]                                        ║
║  RAMP Score: [score]/100 → [level]                            ║
║  Signal: [GREEN/YELLOW/RED]                                   ║
╠═══════════════════════════════════════════════════════════════╣
║  Rollback Owner: [name]                                       ║
║  Rollback Method: [how]                                       ║
║  Kill Signal: [metric > threshold]                            ║
╠═══════════════════════════════════════════════════════════════╣
║  Action: [RAMP DOWN / RAMP CAREFULLY / RAMP UP]               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## MVR vs Full RAMPKIT

| Aspect | MVR (15 min) | Full RAMPKIT (45+ min) |
|--------|--------------|------------------------|
| **Steps** | 4 (R-A-M-P) | 7 (RAMPKIT) |
| **Best For** | L1-L3, urgent | L4-L5, high-stakes |
| **Documentation** | Minimal | Full RAMP Card |
| **Approvals** | Self/peer | Formal if L4+ |
| **Checkpoints** | Implicit | Explicit schedule |
| **Tracking** | Optional | Required |

---

## Integration with SPAR

MVR completes the "Mini Decision Lifecycle" (45 minutes total):

| Phase | Protocol | Question | Time |
|-------|----------|----------|------|
| **Deliberation** | MVS (SPAR) | "What should we do?" | 30 min |
| **Governance** | MVR (RAMP) | "How safe is it to deliver?" | 15 min |

> **"Deliberate to decide. RAMP IT UP to deliver."**

---

## Facilitation Tips

### For Solo MVR (Personal Mode)

Use the "3-Second Screen" for L1 candidates:
> "If this goes wrong, can I fix it in an hour myself?"
> - YES → 🟢 Ship it
> - MAYBE → Run full MVR
> - NO → 🔴 Escalate

### For Team MVR (Huddle Mode)

Use the "Finger Protocol":
1. Facilitator reads the decision
2. On count of 3, everyone shows 1-5 fingers (RAMP level)
3. If fingers differ by >1, discuss for 1 minute
4. Highest (most conservative) level wins

### For CI/CD MVR (Automated Mode)

Use rule-based scoring:
```bash
ramp gate "Deploy auth changes" \
  --schema    # +30 penalty
  --breaking  # +40 penalty
  --flagged   # +20 bonus
  --strict    # Exit 1 on BLOCK
```

---

## Common Patterns

### Feature Flag Rollout
```
Score: 95 → L1
- Undo: YES (+30), flag off in seconds
- Additive: YES (+25), new feature, not replacing
- Blast: YES (+20), staged rollout
- Rollback: YES (+15), kill switch ready
- Detection: YES (+10), error rates monitored
→ 🟢 GREEN: Ship it
```

### Database Migration
```
Score: 50 → L3
- Undo: PARTIAL (+15), can restore from backup
- Additive: NO (0), schema change
- Blast: PARTIAL (+10), affects all using old schema
- Rollback: YES (+15), migration script tested
- Detection: YES (+10), health checks in place
→ 🟡 YELLOW: Ship with checkpoints
```

### Pricing Change
```
Score: 25 → L5
- Undo: NO (0), customer trust impact
- Additive: NO (0), changing existing pricing
- Blast: NO (0), affects all customers
- Rollback: PARTIAL (+15), can revert prices
- Detection: PARTIAL (+10), churn monitoring
→ 🔴 RED: Full RAMPKIT required
```

---

*"Can we undo this?"* ⚡
