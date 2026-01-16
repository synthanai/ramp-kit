# RAMP Levels (L1-L5)

The five-tier classification system for decision reversibility.

---

## Overview

RAMP classifies decisions into five levels based on **reversal time** — how long it takes to undo the action if it goes wrong.

```
⚡ L1 — INSTANT      (<1 hour)   → Ship it
🔄 L2 — RAPID        (<1 day)    → Monitor & Ship
📋 L3 — PLANNED      (<1 week)   → Plan rollback first
⚠️ L4 — EFFORTFUL    (<1 month)  → Require approval
🚫 L5 — IRREVERSIBLE (Permanent) → Full RAMP UP
```

---

## The Five Levels

### ⚡ L1: Instant

**Reversal Time**: < 1 hour

**Characteristics**:
- Can be undone immediately by the person who did it
- No lasting effects if reversed quickly
- Minimal blast radius
- No external dependencies

**Examples**:
- Feature flag toggle
- Config change
- A/B test activation
- Dark launch enablement
- UI copy change

**Action**: **Ship it**. No process required. Trust individual judgment.

**Governance**: None. Post-hoc review optional.

---

### 🔄 L2: Rapid

**Reversal Time**: < 1 day

**Characteristics**:
- Can be undone within a work day
- May require deployment or manual intervention
- Limited blast radius
- Rollback is straightforward

**Examples**:
- Code deployment (with feature flag)
- Backward-compatible schema addition
- Soft rollout to percentage of users
- New API endpoint (non-breaking)

**Action**: **Monitor & Ship**. Deploy with monitoring.

**Governance**: 
- Rollback owner assigned
- Basic monitoring in place
- Single completion checkpoint

---

### 📋 L3: Planned

**Reversal Time**: < 1 week

**Characteristics**:
- Rollback requires planning and coordination
- May involve data migration or multi-step process
- Moderate blast radius
- Rollback is possible but not trivial

**Examples**:
- Database migration (with rollback script)
- Dual-system cutover
- Breaking API change (with version support)
- Infrastructure provider change

**Action**: **Plan rollback first**. Document and test rollback before shipping.

**Governance**:
- Full rollback plan documented
- Rollback plan tested
- Checkpoints at 25%, 50%, 75%, 100%
- Peer review required

---

### ⚠️ L4: Effortful

**Reversal Time**: < 1 month

**Characteristics**:
- Rollback requires significant effort, time, or cost
- May involve partial data loss or rework
- Wide blast radius
- External stakeholders affected

**Examples**:
- Major platform migration
- Vendor replacement
- Pricing model change
- Organizational restructure
- Public product deprecation

**Action**: **Require approval**. Cross-functional review and sign-off.

**Governance**:
- Full RAMPKIT protocol
- Executive sponsor required
- Multiple stakeholder reviews
- Formal sign-off audit trail
- Phase gates at each major milestone

---

### 🚫 L5: Irreversible

**Reversal Time**: Permanent (or effectively permanent)

**Characteristics**:
- Cannot be undone, or cost of reversal is existential
- Permanent consequences
- Trust/reputation at stake
- Legal or contractual implications

**Examples**:
- Data deletion without backup
- Breaking trust with key customers
- Regulatory violation
- Termination of critical partnership
- Public statements that cannot be retracted

**Action**: **Full RAMP UP**. Treat as existential decision.

**Governance**:
- Full RAMPKIT protocol
- Board-level visibility
- Legal/compliance review
- Extended deliberation period
- "Are we absolutely sure?" checkpoint

---

## Level Comparison

| Level | Time | Blast Radius | Process | Approval |
|-------|------|--------------|---------|----------|
| L1 | <1 hour | Individual | None | Self |
| L2 | <1 day | Team | Light | Self/Peer |
| L3 | <1 week | Department | Moderate | Team Lead |
| L4 | <1 month | Organization | Heavy | Executive |
| L5 | Permanent | External | Maximum | Board |

---

## Score to Level Mapping

RAMP Score (0-100) maps to levels:

| Score Range | Level | Direction |
|-------------|-------|-----------|
| 90-100 | L1 (Instant) | 🟢 RAMP DOWN |
| 70-89 | L2 (Rapid) | 🟢 RAMP DOWN |
| 50-69 | L3 (Planned) | 🟡 RAMP CAREFULLY |
| 30-49 | L4 (Effortful) | 🔴 RAMP UP |
| 0-29 | L5 (Irreversible) | 🔴 RAMP UP |

---

## Level Escalation

Levels can escalate due to:

### Scope Creep
What started as L2 becomes L4 when scope expands beyond original blast radius.

### Dependency Discovery
What seemed isolated (L1) turns out to depend on critical systems (L3+).

### Time Pressure
Rushed execution removes rollback capability, escalating level.

### External Factors
Regulatory, legal, or partner constraints elevate level.

**Practice**: Re-assess level if any of these occur. Use the **Momentum Brake** pattern from CLIMBS.

---

## Common Misclassifications

### "It's just a small change" (L1 → Actually L3)
Small changes can have outsized impact if they touch critical paths.

### "We can always roll back" (L2 → Actually L4)
Rollback is only viable if it's tested and data can be restored.

### "It only affects internal users" (L2 → Actually L3)
Internal users include support, sales, and operations who affect external customers.

### "We've done this before" (L2 → Actually L3+)
Past success doesn't guarantee future success, especially if context has changed.

---

## Level-Specific Checklists

### L1 Checklist
- [ ] Can I undo this in < 1 hour myself?
- [ ] Does this only affect me/my team?

### L2 Checklist
- [ ] Is there a known rollback method?
- [ ] Is monitoring in place?
- [ ] Is a rollback owner assigned?

### L3 Checklist
- [ ] Is the rollback plan documented?
- [ ] Has the rollback been tested?
- [ ] Are checkpoints scheduled?
- [ ] Is peer review complete?

### L4 Checklist
- [ ] Is the RAMP Brief complete?
- [ ] Are all stakeholders reviewed?
- [ ] Is executive sign-off obtained?
- [ ] Are phase gates defined?

### L5 Checklist
- [ ] Is this truly necessary?
- [ ] Have alternatives been exhausted?
- [ ] Is board-level visibility in place?
- [ ] Is legal/compliance cleared?
- [ ] Is there an "are we sure?" checkpoint?

---

*"Match process to consequence."* 🚪
