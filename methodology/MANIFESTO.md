# The RAMP Manifesto

## Core Thesis

> **"The enemy is not bad decisions. The enemy is irreversible decisions made too cheaply."**

RAMP (Reversible Action Management Protocol) is a methodology for governing decision velocity by focusing on **reversibility** as the primary driver of process weight. It operationalizes Jeff Bezos's "one-way door" (Type 1) and "two-way door" (Type 2) decision framework into a systematic operational protocol.

---

## Four Values

We value:

### 1. REVERSIBILITY over RIGIDITY
Design for undo over design for perfection.

The goal is not to make perfect decisions. The goal is to make decisions that can be corrected when new information arrives. Build rollback paths, not approval chains.

### 2. PROPORTIONAL PROCESS over UNIFORM PROCEDURE
Match controls to consequences.

Not all decisions deserve equal weight. A feature flag toggle should not require the same review process as a database migration. The rigor of the process should scale with the irreversibility of the action.

### 3. MOMENTUM WITH CHECKPOINTS over APPROVAL BOTTLENECKS
Pauses for awareness, not gates for permission.

Speed is valuable. But speed without awareness is recklessness. RAMP inserts **pauses** — moments to check signals and verify rollback capability — rather than **gates** requiring external approval.

### 4. OBSERVABLE CONTAINMENT over ASSUMED SAFETY
Blast radius awareness over optimistic deployment.

"It only affects one module" is almost never true. Every action should declare its blast radius explicitly. Every rollback path should have observable signals that trigger it.

---

## The 12 Principles

### Velocity

1. **Preserve decision velocity** by fast-tracking reversible actions.
2. **Welcome changing requirements**; harness change via reversible architectures.
3. **Deliver working rollbacks frequently** (hours to days).

### Judgment

4. **Irreversible decisions involve all**; reversible ones involve only those affected.
5. **Trust judgment on two-way doors** with clear assessments.
6. **Convey risk** via RAMP Score (0-100) and rollback path.

### Quality

7. **Working rollback mechanisms** are the primary measure of preparedness.
8. **Maintain a constant rhythm** of assessing reversibility.
9. **Technical excellence and containment design** enhance reversibility.

### Architecture

10. **Simplicity** — maximizing the number of reversible decisions — is essential.
11. **Best designs emerge** from teams that understand blast radius.
12. **Regularly reflect** on which decisions were actually irreversible and adjust.

---

## The RAMP Philosophy

### Bezos's Insight

Jeff Bezos identified that most organizational dysfunction stems from treating all decisions the same:

> "Some decisions are consequential and irreversible or nearly irreversible — one-way doors — and these decisions must be made methodically, carefully, slowly, with great deliberation and consultation... But most decisions aren't like that — they are changeable, reversible — they're two-way doors."

### The Two Failure Modes

**1. Excessive Rigor on Reversible Decisions**

Organizations apply heavyweight governance to trivial, reversible decisions. Feature flag toggles require architecture review. Config changes need CAB approval. Teams become paralyzed by process theater.

*Cost*: Velocity death. Competitive disadvantage. Talent attrition.

**2. Insufficient Rigor on Irreversible Decisions**

Organizations ship high-stakes, hard-to-reverse decisions with the same lightweight process they use for feature flags. Database migrations deploy without tested rollback plans. Pricing changes launch without containment.

*Cost*: Preventable disasters. Trust destruction. Existential risk.

### The RAMP Solution

RAMP creates **proportional governance**:

- **RAMP DOWN** on two-way doors → Optimize for speed
- **RAMP UP** on one-way doors → Optimize for rigor

The key insight: **reversibility determines required process weight**.

---

## The Question

At the heart of RAMP is one question:

> **"Can we undo this?"**

This question triggers the entire methodology:

- **If yes (easily)**: RAMP DOWN. Ship it. Move fast.
- **If yes (with effort)**: RAMP CAREFULLY. Ship with monitoring.
- **If no**: RAMP UP. Stop. Add rigor.

---

## RAMP as Counter-Pattern

RAMP is explicitly a counter-pattern to:

| Anti-Pattern | RAMP Counter |
|--------------|--------------|
| Uniform approval chains | Proportional process based on reversibility |
| Optimistic "we can always fix it" | Explicit rollback paths before shipping |
| "Move fast and break things" | Move fast on two-way doors, slow on one-way |
| Analysis paralysis | Fast-track reversible decisions |
| Security theater | Observable containment with signals |

---

## The RAMP Stance

RAMP practitioners adopt a specific stance toward action:

1. **I will classify before I commit.** Every action gets a reversibility assessment.

2. **I will match rigor to consequence.** My process weight scales with irreversibility.

3. **I will prepare rollback before rollout.** The undo button exists before I press go.

4. **I will define signals before I ship.** I know what "broken" looks like and when to reverse.

5. **I will own the rollback.** Someone is accountable for the undo path.

---

## The Deeper Pattern

RAMP isn't just an operational framework. It's an epistemological stance:

> *I don't know if this will work.*
>
> *I can't predict all consequences.*
>
> *What I can control is my ability to recover.*
>
> *The question isn't "will this succeed?" — it's "can we undo this if it doesn't?"*

This is humility operationalized. It acknowledges uncertainty while maintaining velocity.

---

## The Tagline

> **"Move fast on two-way doors. Slow down on one-way doors."**

or simply:

> **"Can we undo this?"**

---

*RAMP IT UP to deliver.* 🚪
