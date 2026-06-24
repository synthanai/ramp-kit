# DOORS: The Reversibility Principles

Five epistemological stances for RAMP practitioners.

---

## Core Concept

> **"Check the DOORS before you walk through."**

DOORS provides the practitioner stance for reversibility governance. Before committing to any action, check each principle to ensure you're prepared for what lies on the other side.

---

## The Five Principles

### D — DECLARE

**Stance**: State reversibility explicitly before acting.

**Practice**:
- Name the door type (Two-way, Heavy, One-way)
- If you cannot classify the door, you cannot proceed
- Make the classification visible to others

**30-Second Check**:
> "This is a [door type] decision."

**Anti-Pattern**: Implicit assumptions like "we can always fix it later."

---

### O — OBSERVE

**Stance**: Watch for irreversibility triggers before they close the door.

**Practice**:
- Identify what would convert a reversible action into an irreversible one
- Monitor proximity to "points of no return"
- Name the conditions that would close the door

**30-Second Check**:
> "The door closes if [condition]."

**Examples of Irreversibility Triggers**:
- Deleting original data after migration
- Public announcement before internal readiness
- Contract signature before due diligence
- Burning bridges with key partners

---

### O — OWN

**Stance**: Assign accountability for the rollback path.

**Practice**:
- Name a specific individual as the **Rollback Owner**
- Ensure they have the authority to trigger reversal
- Ensure they have the capability to execute reversal
- The Rollback Owner is not optional

**30-Second Check**:
> "[Name] owns the rollback."

**Criteria for Rollback Owner**:
- Has decision authority (can pull the trigger without asking)
- Has technical capability (can execute or delegate)
- Has availability (is reachable when needed)
- Has context (understands the action and its risks)

---

### R — READY

**Stance**: Prepare the rollback before committing forward.

**Practice**:
- Write the rollback runbook *before* the deploy runbook
- Test the rollback in a non-production environment
- Verify rollback capability remains intact at checkpoints
- "Ready to rollback" is a precondition for shipping

**30-Second Check**:
> "We can rollback by [method] in [timeframe]."

**The Rollback Readiness Test**:
1. Is the rollback documented?
2. Has it been tested?
3. Is it still viable? (dependency changes, data changes)
4. Can it be executed under pressure?

---

### S — SIGNAL

**Stance**: Define observable indicators that trigger reversal.

**Practice**:
- Set quantitative thresholds (e.g., "Error rate > 1%")
- Pre-authorize rollback at the signal threshold
- Remove judgment calls under pressure
- Make signals visible and automated where possible

**30-Second Check**:
> "We rollback when [signal]."

**Good Signal Characteristics**:
- **Quantitative**: A number, not a feeling
- **Observable**: Can be measured/detected
- **Timely**: Fires fast enough to contain damage
- **Actionable**: Clear trigger for rollback

**Examples**:
- Error rate > 1% for 5 minutes
- Latency p99 > 500ms
- Customer complaints > 5 in first hour
- Revenue drop > 10% hour-over-hour

---

## The 30-Second DOORS Check

For rapid (L1-L2) decisions, use this one-liner:

> "This is a **[door type]**. If **[trigger]** happens, **[owner]** will **[rollback action]** when we see **[signal]**."

**Example**:
> "This is a two-way door. If users can't login, Sarah will revert the auth commit when we see error rate above 1%."

---

## DOORS in Practice

### Before Shipping (D-O-O-R)

| Principle | Question | Required? |
|-----------|----------|-----------|
| **D**eclare | Is the door type explicit? | Always |
| **O**bserve | Are irreversibility triggers named? | L3+ |
| **O**wn | Is there a named rollback owner? | Always |
| **R**eady | Is rollback tested and viable? | L2+ |

### During Execution (S)

| Principle | Question | Required? |
|-----------|----------|-----------|
| **S**ignal | Are signals being monitored? | L2+ |
| **S**ignal | Would a threshold breach trigger rollback? | L3+ |

---

## DOORS Applied to RAMP Levels

| Level | D | O | O | R | S |
|-------|---|---|---|---|---|
| L1 | ✓ | - | ✓ | - | - |
| L2 | ✓ | - | ✓ | ✓ | ✓ |
| L3 | ✓ | ✓ | ✓ | ✓ | ✓ |
| L4 | ✓ | ✓ | ✓ | ✓ | ✓ |
| L5 | ✓ | ✓ | ✓ | ✓ | ✓ |

**Legend**: ✓ = Required, - = Optional

---

## Common DOORS Failures

### D Failures (Declaration)
- "We assumed it was reversible"
- "Nobody said it was one-way"
- "The reversibility wasn't discussed"

### O Failures (Observation)
- "We didn't realize deleting the backup would..."
- "We didn't see the contract clause that..."
- "We didn't notice when it became irreversible"

### O Failures (Ownership)
- "We thought someone else was handling rollback"
- "The rollback owner was on vacation"
- "Nobody was authorized to make that call"

### R Failures (Readiness)
- "The rollback script had never been tested"
- "We couldn't rollback because the schema had drifted"
- "We didn't have the credentials to rollback"

### S Failures (Signals)
- "We didn't have monitoring in place"
- "We saw the signal but didn't know when to act"
- "We waited too long to pull the trigger"

---

## DOORS as a Team Ritual

### Sprint Planning
Before accepting a story:
> "What DOORS checks does this story require?"

### PR Review
Before approving:
> "Are DOORS documented for this change?"

### Deployment
Before shipping:
> "Have we completed the DOORS checklist?"

---

## The Deeper Pattern

DOORS embodies a specific stance toward action:

> *I will not assume reversibility. I will declare it.*
>
> *I will not hope for the best. I will watch for the worst.*
>
> *I will not assume someone handles rollback. I will name them.*
>
> *I will not trust untested rollback. I will verify it.*
>
> *I will not rely on judgment under pressure. I will pre-define signals.*

---

*"Check the DOORS before you walk through."* 🚪
