# The Four Laws of RAMP

The foundational physics of reversibility governance.

---

## Overview

The Four Laws form the bedrock of the RAMP methodology. They encode the fundamental truths about how reversibility should govern action.

---

## Law 1: The Law of Reversibility

> **"Every action must declare its nature: Reversible, Costly to Reverse, or Irreversible."**

### Implications

- **No action proceeds without explicit classification.** The door type must be named before walking through.

- **Classification maps to RAMP Levels (L1-L5).** The declaration isn't subjective — it's quantified.

- **Implicit assumptions about reversibility are the leading cause of preventable regret.** "We can always roll back" is not classification — it's hope.

### Practice

Before any action:
1. Ask: "What type of door is this?"
2. Score the reversibility (0-100)
3. Map to RAMP Level (L1-L5)
4. Only then proceed

---

## Law 2: The Law of Proportional Autonomy

> **"Autonomy scales with reversibility. More reversible = more autonomy."**

### Implications

- **Controls should match consequences, not organizational hierarchy.** A junior engineer should have full autonomy over L1 decisions. A senior executive should have limited autonomy over L5 decisions.

- **Reversible (L1-L2) actions are fast-tracked.** Individual or team autonomy. Minimal process.

- **Irreversible (L4-L5) actions require higher accountability.** Cross-functional review. Formal sign-off.

### Practice

| Level | Autonomy | Approval |
|-------|----------|----------|
| L1 | Full individual | Self |
| L2 | Full team | Peer |
| L3 | Guided | Team lead |
| L4 | Constrained | Executive |
| L5 | Minimal | Board/All |

---

## Law 3: The Law of Momentum Interrupts

> **"Auto-insert pauses when confidence spikes or scope expands."**

### Implications

- **Scope creep toward irreversibility triggers automatic re-assessment.** If an L2 action starts looking like L4, stop and re-evaluate.

- **Pauses are moments to regain situational awareness.** They're not "approvals" — they're reflection points.

- **Prevents silent escalation.** L1 "quick tweaks" can silently evolve into L4 "permanent migrations" without anyone noticing.

### Practice

Insert a Momentum Brake when:
- Scope expands beyond original blast radius
- Timeline extends beyond original estimate
- Stakeholders multiply
- Confidence spikes ("this is definitely fine")
- Complexity increases

---

## Law 4: The Law of Containment

> **"Every action declares blast radius, rollback path, and observable signals."**

### Implications

- **Reversibility is theoretical without a tested rollback path.** Saying "we can undo it" means nothing if you haven't tested the undo.

- **Rollback is useless without signals that trigger it.** You must know *when* to reverse, not just *how*.

- **The Containment Triangle must be complete:**

```
         Blast Radius
            /\
           /  \
          /    \
         /      \
        /________\
   Rollback     Signals
```

### Practice

Before shipping, document:
1. **Blast Radius**: What/who is affected?
2. **Rollback Path**: How do we undo? Who owns it? Is it tested?
3. **Signals**: What tells us to reverse? At what threshold?

---

## The Laws in Action

### Example: Feature Flag Rollout

| Law | Application |
|-----|-------------|
| **Law 1** | Classified as L1 — toggle reversible in seconds |
| **Law 2** | Individual engineer can ship autonomously |
| **Law 3** | No pause needed — scope is contained |
| **Law 4** | Blast radius: 10% of users. Rollback: flag off. Signal: error rate > 0.5% |

### Example: Database Migration

| Law | Application |
|-----|-------------|
| **Law 1** | Classified as L3 — rollback takes days |
| **Law 2** | Team lead approval required |
| **Law 3** | Pauses at 25%, 50%, 75% rollout |
| **Law 4** | Blast radius: all users. Rollback: restore script (tested). Signal: latency > 200ms |

### Example: Pricing Change

| Law | Application |
|-----|-------------|
| **Law 1** | Classified as L5 — trust impact irreversible |
| **Law 2** | Executive sign-off + board visibility |
| **Law 3** | Extended deliberation period |
| **Law 4** | Blast radius: all customers. Rollback: revert prices (but trust damage remains). Signal: churn > 5% |

---

## The Laws as Constraints

The Four Laws constrain action in healthy ways:

1. **You cannot act without classifying.** No undeclared door-walking.
2. **You cannot bypass governance based on seniority.** Irreversibility trumps hierarchy.
3. **You cannot ignore scope creep.** Momentum brakes are automatic.
4. **You cannot ship without containment.** Blast radius, rollback, signals — all required.

---

## The Laws as Enablers

The Four Laws also enable velocity:

1. **Explicit classification enables fast-tracking.** L1-L2 decisions move fast because they're declared.
2. **Proportional autonomy removes bottlenecks.** No waiting for approval on reversible actions.
3. **Momentum interrupts prevent disasters.** Catching escalation early is faster than recovering from failure.
4. **Containment enables confidence.** Knowing the blast radius enables shipping, not paralysis.

---

## Violations

### Law 1 Violations
- "We didn't discuss reversibility"
- "We assumed it was fine"
- "Nobody classified the door"

### Law 2 Violations
- "Legal had to approve the feature flag"
- "The junior couldn't ship their L1 change"
- "The VP shipped the L5 decision alone"

### Law 3 Violations
- "It was supposed to be small but it grew"
- "We didn't stop to re-assess when scope changed"
- "We were too confident to pause"

### Law 4 Violations
- "We didn't know who was affected"
- "We didn't have a rollback plan"
- "We didn't know when to reverse"

---

*These laws are not guidelines. They are physics.* 🚪
