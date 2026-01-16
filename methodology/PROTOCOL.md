# RAMPKIT: The 7-Step Protocol

RAMPKIT is the complete operational protocol for governing decisions based on reversibility. It moves a decision from identification through safe delivery to learning.

---

## Overview

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

---

## The 7 Steps

| Step | Phase | Key Question | Output | Time |
|------|-------|--------------|--------|------|
| **R** | Recognize | "What are we doing?" | Decision statement | 5 min |
| **A** | Assess | "How reversible is it?" | RAMP Score (0-100) | 10 min |
| **M** | Map | "What's the containment plan?" | Rollback plan & Signals | 10 min |
| **P** | Position | "RAMP UP or RAMP DOWN?" | Direction decision | 5 min |
| **K** | Kickoff | "Who owns this?" | RAMP Card | 5 min |
| **I** | Inspect | "Are signals nominal?" | Checkpoint reviews | Ongoing |
| **T** | Track | "What did we learn?" | Decision record | 5 min |

**Total time**: ~45 minutes for full protocol

---

## Step Details

### R: RECOGNIZE

**Purpose**: Explicitly define the action before assessing it.

**Key Question**: "What are we doing?"

**Template**:
```
We are [ACTION] affecting [SCOPE] starting [WHEN] because [WHY].
If it fails, [CONSEQUENCE].
```

**Example**:
> We are migrating the auth database to PostgreSQL affecting all user authentication starting next sprint because of scaling limits. If it fails, users cannot log in.

**Output**: Clear decision statement with scope and failure mode.

---

### A: ASSESS

**Purpose**: Quantify reversibility through structured questions.

**Key Question**: "How reversible is it?"

**The Five Assessment Questions**:

| # | Question | High (+) | Medium | Low (0) |
|---|----------|----------|--------|---------|
| 1 | Can we undo this within 24 hours? | +30 | +15 | 0 |
| 2 | Is this additive (not destructive)? | +25 | +15 | 0 |
| 3 | Can we limit the blast radius? | +20 | +10 | 0 |
| 4 | Do we have a tested rollback? | +15 | +10 | 0 |
| 5 | Can we detect problems quickly? | +10 | +5 | 0 |

**Score to Level Mapping**:
- **90-100**: L1 (Instant) ⚡
- **70-89**: L2 (Rapid) 🔄
- **50-69**: L3 (Planned) 📋
- **30-49**: L4 (Effortful) ⚠️
- **0-29**: L5 (Irreversible) 🚫

**Example**:
> Auth DB migration: Undo=15 + Additive=0 + Blast=10 + Rollback=15 + Detection=10 = **50 → L3**

---

### M: MAP

**Purpose**: Document the containment plan.

**Key Question**: "What's the containment plan?"

**The Containment Triangle**:

```
         Blast Radius
            /\
           /  \
          /    \
         /      \
        /________\
   Rollback     Signals
```

**Document**:

1. **Blast Radius**
   - What systems are affected?
   - What users are affected?
   - What's the revenue impact if it fails?

2. **Rollback Path**
   - How do we undo this?
   - Who can execute the rollback?
   - How long does rollback take?
   - What's the rollback cost?

3. **Observable Signals**
   - What metrics indicate failure?
   - What thresholds trigger rollback?
   - Who monitors the signals?

4. **Irreversibility Triggers**
   - What would make this unrecoverable?
   - At what point is there "no going back"?

**Template**:
```
BLAST RADIUS:
- Systems: [list]
- Users: [count/segment]
- Revenue at risk: [amount]

ROLLBACK PATH:
- Method: [how]
- Owner: [who]
- Time: [how long]
- Cost: [effort/money]

SIGNALS:
- [Metric] > [Threshold] → Trigger rollback
- [Metric] > [Threshold] → Alert owner

IRREVERSIBILITY TRIGGERS:
- [Condition] → Point of no return
```

---

### P: POSITION

**Purpose**: Decide the governance level based on assessment.

**Key Question**: "RAMP UP or RAMP DOWN?"

**Decision Matrix**:

| Score/Level | Direction | Action |
|-------------|-----------|--------|
| L1 (90-100) | 🟢 RAMP DOWN | Ship it now |
| L2 (70-89) | 🟢 RAMP DOWN | Ship with monitoring |
| L3 (50-69) | 🟡 RAMP CAREFULLY | Add checkpoints |
| L4 (30-49) | 🔴 RAMP UP | Require approval |
| L5 (0-29) | 🔴 RAMP UP | Full governance |

**RAMP DOWN means**:
- Optimize for speed
- Individual/team autonomy
- Light documentation
- Post-hoc review acceptable

**RAMP UP means**:
- Optimize for rigor
- Cross-functional involvement
- Full documentation required
- Pre-approval mandatory

---

### K: KICKOFF

**Purpose**: Create accountability and initiate execution.

**Key Question**: "Who owns this?"

**The RAMP Card**:

```
╔═══════════════════════════════════════════════════════════════╗
║  RAMP CARD                                                    ║
╠═══════════════════════════════════════════════════════════════╣
║  Decision: [statement]                                        ║
║  RAMP Score: [score]/100 → [level]                            ║
║  Direction: [RAMP UP/DOWN]                                    ║
╠═══════════════════════════════════════════════════════════════╣
║  RAMP Owner: [name]        Rollback Owner: [name]             ║
║  Start: [date]             Checkpoints: [schedule]            ║
╠═══════════════════════════════════════════════════════════════╣
║  Rollback Method: [how]                                       ║
║  Kill Signal: [metric > threshold]                            ║
╠═══════════════════════════════════════════════════════════════╣
║  Status: [ ] Active  [ ] Shipped  [ ] Rolled Back             ║
╚═══════════════════════════════════════════════════════════════╝
```

**Assign**:
- **RAMP Owner**: Accountable for the decision
- **Rollback Owner**: Authorized and capable of reversal
- **Checkpoint Schedule**: When to verify (based on level)

---

### I: INSPECT

**Purpose**: Monitor signals and verify rollback capability at checkpoints.

**Key Question**: "Are signals nominal?"

**Checkpoint Frequency by Level**:

| Level | Checkpoints |
|-------|-------------|
| L1 | None (post-hoc review if desired) |
| L2 | At completion |
| L3 | At 25%, 50%, 75%, 100% |
| L4 | At each major phase + exec review |
| L5 | Continuous + formal gate reviews |

**At Each Checkpoint**:
1. Are signals within thresholds?
2. Is rollback capability still intact?
3. Has scope changed (triggering re-assessment)?

**If signals breach threshold**: Execute rollback per plan.

---

### T: TRACK

**Purpose**: Record outcome and extract learning.

**Key Question**: "What did we learn?"

**Record**:
- **Outcome**: Shipped / Rolled Back / Blocked / Incident
- **Predicted vs Actual**: Was the RAMP Score accurate?
- **Time to execute**: How long did delivery take?
- **Time to detect**: How quickly did we know the outcome?
- **Time to rollback**: If rolled back, how long?

**Learning Questions**:
1. Was the RAMP Score accurate?
2. What would we change about the assessment?
3. What signals were most useful?
4. Was the rollback plan adequate?

**Archive**: Store RAMP Card in decision history for organizational learning.

---

## Quick Reference

```
RAMPKIT in 30 seconds:

R ─ RECOGNIZE: "What are we doing?"
A ─ ASSESS: "How reversible?" (Score 0-100)
M ─ MAP: Blast radius + Rollback + Signals
P ─ POSITION: RAMP UP or DOWN?
K ─ KICKOFF: Assign owners, create card
I ─ INSPECT: Check signals at checkpoints
T ─ TRACK: Record outcome, extract learning

Full protocol: ~45 minutes
For rapid assessment: Use MVR (15 minutes) — R-A-M-P only
```

---

## MVR: The Rapid Version

For time-constrained decisions, use only the first 4 steps:

**MVR = R → A → M → P** (15 minutes)

See [MVR_PROTOCOL.md](MVR_PROTOCOL.md) for details.

---

*"Can we undo this?"* 🚪
