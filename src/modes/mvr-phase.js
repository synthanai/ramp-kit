/**
 * MVR PHASE Modes - Mode-specific implementations
 * 
 * Personal: 5-min mental 'RAMP Tap'
 * Huddle: 3-min/item 'RAMP Round' with finger voting
 * Automated: <30sec pipeline 'RAMP Gate'
 * Supported: 10-15min AI 'RAMP Copilot'
 * Enterprise: 30-45min 'RAMP Brief' with sign-offs
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import boxen from 'boxen';
import Table from 'cli-table3';

import {
    RAMP_LEVELS,
    ASSESSMENT_QUESTIONS,
    scoreToLevel,
    levelToSignal,
    generateId,
    saveDecision,
    getConfig
} from '../lib/utils.js';

// ════════════════════════════════════════════════════════════════
// PERSONAL MODE: The "RAMP Tap" (5 min mental checklist)
// ════════════════════════════════════════════════════════════════

export async function mvrPersonal(description) {
    console.log(boxen(
        `${chalk.yellow.bold('👤 PERSONAL MVR: The "RAMP Tap"')}\n` +
        `${chalk.dim('5-minute mental checklist')}`,
        { padding: 1, borderColor: 'yellow' }
    ));

    // Quick gut-check version
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'decision',
            message: 'What are you shipping?',
            default: description,
            validate: i => i.length > 0 || 'Required'
        },
        {
            type: 'list',
            name: 'undoTime',
            message: 'Can you undo this in an hour yourself?',
            choices: [
                { name: `${chalk.green('✅ Yes')} — I can fix it quickly`, value: 'L1' },
                { name: `${chalk.green('🔄 Mostly')} — Same day with effort`, value: 'L2' },
                { name: `${chalk.yellow('📋 Need a plan')} — Takes a week`, value: 'L3' },
                { name: `${chalk.red('⚠️ Hard')} — Month+ of work`, value: 'L4' },
                { name: `${chalk.magenta('🚫 Can\'t')} — Irreversible`, value: 'L5' }
            ]
        },
        {
            type: 'confirm',
            name: 'iAmOwner',
            message: 'Are YOU the rollback owner?',
            default: true
        }
    ]);

    const level = answers.undoTime;
    const levelInfo = RAMP_LEVELS[level];
    const signal = levelToSignal(level);

    // Quick result
    console.log(boxen(
        `${chalk.bold('Decision:')} ${answers.decision}\n` +
        `${chalk.bold('Level:')} ${levelInfo.emoji} ${chalk[levelInfo.color].bold(level)}\n` +
        `${chalk.bold('Owner:')} ${answers.iAmOwner ? 'Me' : 'Need to assign'}\n\n` +
        `${chalk.bold(signal.signal)} → ${signal.action}`,
        { padding: 1, borderColor: levelInfo.color }
    ));

    // Escalation check
    if (level === 'L3') {
        console.log(chalk.yellow('\n💡 Consider: ramp mvr --mode huddle (get team input)\n'));
    } else if (level === 'L4' || level === 'L5') {
        console.log(chalk.red('\n⚠️  Escalate: ramp mvr --mode enterprise\n'));
    }

    // Commit message helper
    if (level === 'L1' || level === 'L2') {
        console.log(chalk.dim(`Commit suggestion: feat: ${answers.decision.substring(0, 30)}... [RAMP ${level}]`));
    }

    return { level, decision: answers.decision, mode: 'personal' };
}

// ════════════════════════════════════════════════════════════════
// HUDDLE MODE: The "RAMP Round" (3 min/item, team finger voting)
// ════════════════════════════════════════════════════════════════

export async function mvrHuddle() {
    console.log(boxen(
        `${chalk.cyan.bold('👥 HUDDLE MVR: The "RAMP Round"')}\n` +
        `${chalk.dim('3 minutes per item • Team finger voting')}`,
        { padding: 1, borderColor: 'cyan' }
    ));

    console.log(chalk.dim('\nFacilitator script: "Let\'s RAMP the items on this sprint."\n'));

    // Get items to assess
    const { itemCount } = await inquirer.prompt([
        {
            type: 'number',
            name: 'itemCount',
            message: 'How many items to RAMP?',
            default: 3,
            validate: n => n > 0 && n <= 10 || 'Enter 1-10'
        }
    ]);

    const results = [];

    for (let i = 1; i <= itemCount; i++) {
        console.log(chalk.bold.cyan(`\n─── Item ${i}/${itemCount} ───\n`));

        const itemAnswers = await inquirer.prompt([
            {
                type: 'input',
                name: 'description',
                message: `Item ${i} description:`,
                validate: i => i.length > 0 || 'Required'
            },
            {
                type: 'list',
                name: 'teamLevel',
                message: '🖐️  Team finger vote (show 1-5 fingers, record consensus):',
                choices: [
                    { name: `1 finger → ${chalk.green('L1')} (Instant, <1h)`, value: 'L1' },
                    { name: `2 fingers → ${chalk.green('L2')} (Rapid, <1d)`, value: 'L2' },
                    { name: `3 fingers → ${chalk.yellow('L3')} (Planned, <1w)`, value: 'L3' },
                    { name: `4 fingers → ${chalk.red('L4')} (Effortful, <1mo)`, value: 'L4' },
                    { name: `5 fingers → ${chalk.magenta('L5')} (Irreversible)`, value: 'L5' }
                ]
            },
            {
                type: 'confirm',
                name: 'disagreement',
                message: 'Was there disagreement (>1 level apart)?',
                default: false
            },
            {
                type: 'input',
                name: 'owner',
                message: 'Rollback owner (@name):',
                validate: i => i.length > 0 || 'Required'
            }
        ]);

        const level = itemAnswers.disagreement ?
            // Highest level wins if disagreement
            await getHigherLevel(itemAnswers.teamLevel) :
            itemAnswers.teamLevel;

        const levelInfo = RAMP_LEVELS[level];
        const signal = levelToSignal(level);

        results.push({
            item: i,
            description: itemAnswers.description,
            level,
            owner: itemAnswers.owner,
            disagreement: itemAnswers.disagreement,
            signal: signal.signal
        });

        // Quick confirmation
        console.log(chalk[levelInfo.color](
            `\n  ${levelInfo.emoji} ${level} — ${signal.signal} — Owner: ${itemAnswers.owner}`
        ));
    }

    // Summary table
    console.log(chalk.bold.cyan('\n═══ RAMP Round Summary ═══\n'));

    const table = new Table({
        head: ['#', 'Item', 'Level', 'Signal', 'Owner'].map(h => chalk.bold(h)),
        style: { head: [], border: [] }
    });

    results.forEach(r => {
        const levelInfo = RAMP_LEVELS[r.level];
        table.push([
            r.item,
            r.description.substring(0, 30) + '...',
            chalk[levelInfo.color](`${levelInfo.emoji} ${r.level}`),
            r.signal,
            r.owner
        ]);
    });

    console.log(table.toString());

    // Ticket annotation helper
    console.log(chalk.dim('\n📋 Ticket annotations to copy:\n'));
    results.forEach(r => {
        const levelInfo = RAMP_LEVELS[r.level];
        console.log(chalk.dim(`  ## RAMP: ${levelInfo.emoji} ${r.level}`));
        console.log(chalk.dim(`  - **Rollback Owner**: ${r.owner}`));
        console.log(chalk.dim(`  - **Signal**: ${r.signal}\n`));
    });

    // Escalation warnings
    const escalations = results.filter(r => r.level === 'L4' || r.level === 'L5');
    if (escalations.length > 0) {
        console.log(boxen(
            `${chalk.red.bold('⚠️  ESCALATION REQUIRED')}\n\n` +
            `${escalations.length} item(s) need full RAMPKIT:\n` +
            escalations.map(e => `  • ${e.description.substring(0, 40)}...`).join('\n'),
            { padding: 1, borderColor: 'red' }
        ));
    }

    return { mode: 'huddle', items: results };
}

async function getHigherLevel(baseLevel) {
    const { actualLevel } = await inquirer.prompt([
        {
            type: 'list',
            name: 'actualLevel',
            message: 'Disagreement detected. What was the HIGHEST level suggested?',
            choices: [
                { name: `${chalk.yellow('L3')} (Planned)`, value: 'L3' },
                { name: `${chalk.red('L4')} (Effortful)`, value: 'L4' },
                { name: `${chalk.magenta('L5')} (Irreversible)`, value: 'L5' }
            ]
        }
    ]);
    return actualLevel;
}

// ════════════════════════════════════════════════════════════════
// AUTOMATED MODE: The "RAMP Gate" (<30 sec, pipeline output)
// ════════════════════════════════════════════════════════════════

export async function mvrAutomated(description, options) {
    // Parse structured input for CI/CD
    const input = {
        decision: description || options.decision || 'Unnamed change',
        schemaChange: options.schema || false,
        breakingChange: options.breaking || false,
        featureFlagged: options.flagged || false,
        hasRollback: options.rollback || false,
        hasMonitoring: options.monitoring || false,
        owner: options.owner || 'unassigned'
    };

    // Calculate score based on flags
    let score = 0;

    // Q1: Undo in 24h?
    if (!input.schemaChange && !input.breakingChange) score += 30;
    else if (input.featureFlagged) score += 15;

    // Q2: Additive?
    if (!input.breakingChange) score += 25;
    else if (input.featureFlagged) score += 15;

    // Q3: Limit blast radius?
    if (input.featureFlagged) score += 20;
    else score += 10;

    // Q4: Rollback known?
    if (input.hasRollback) score += 15;
    else score += 5;

    // Q5: Quick detection?
    if (input.hasMonitoring) score += 10;
    else score += 5;

    const level = scoreToLevel(score);
    const levelInfo = RAMP_LEVELS[level];
    const signal = levelToSignal(level);

    // Determine gate result
    let gate = 'PASS';
    let gateColor = 'green';
    if (score < 50) {
        gate = 'BLOCK';
        gateColor = 'red';
    } else if (score < 70) {
        gate = 'WARN';
        gateColor = 'yellow';
    }

    const result = {
        mode: 'automated',
        decision: input.decision,
        score,
        level,
        gate,
        owner: input.owner,
        signal: signal.action,
        timestamp: new Date().toISOString(),
        inputs: input
    };

    // Output format based on options
    if (options.json) {
        console.log(JSON.stringify(result, null, 2));
    } else if (options.oneline) {
        console.log(`RAMP_GATE=${gate} RAMP_LEVEL=${level} RAMP_SCORE=${score}`);
    } else {
        // Pretty output for terminal
        console.log(boxen(
            `${chalk.bold('🤖 AUTOMATED MVR: RAMP Gate')}\n\n` +
            `${chalk.bold('Decision:')} ${input.decision}\n` +
            `${chalk.bold('Score:')} ${score}/100 → ${levelInfo.emoji} ${level}\n` +
            `${chalk.bold('Owner:')} ${input.owner}\n\n` +
            `${chalk.bold('Inputs:')}\n` +
            `  Schema change: ${input.schemaChange ? '⚠️ Yes' : '✓ No'}\n` +
            `  Breaking change: ${input.breakingChange ? '⚠️ Yes' : '✓ No'}\n` +
            `  Feature flagged: ${input.featureFlagged ? '✓ Yes' : '○ No'}\n` +
            `  Rollback script: ${input.hasRollback ? '✓ Yes' : '○ No'}\n` +
            `  Monitoring: ${input.hasMonitoring ? '✓ Yes' : '○ No'}\n\n` +
            `${chalk[gateColor].bold(`GATE: ${gate}`)}` +
            (gate === 'BLOCK' ? `\n${chalk.red('Reason: Score <50 requires human review')}` : ''),
            {
                padding: 1,
                borderColor: gateColor,
                title: gate === 'PASS' ? '✓ PASS' : gate === 'WARN' ? '⚠ WARN' : '✗ BLOCK',
                titleAlignment: 'center'
            }
        ));
    }

    // Exit code for CI/CD
    if (gate === 'BLOCK' && options.strict) {
        process.exit(1);
    }

    return result;
}

// ════════════════════════════════════════════════════════════════
// SUPPORTED MODE: The "RAMP Copilot" (10-15 min, AI suggestions)
// ════════════════════════════════════════════════════════════════

export async function mvrSupported(description) {
    console.log(boxen(
        `${chalk.green.bold('🤝 SUPPORTED MVR: RAMP Copilot')}\n` +
        `${chalk.dim('10-15 minutes • AI-augmented assessment')}`,
        { padding: 1, borderColor: 'green' }
    ));

    // Get decision details
    const { decision, domain } = await inquirer.prompt([
        {
            type: 'input',
            name: 'decision',
            message: 'What decision are you assessing?',
            default: description,
            validate: i => i.length > 0 || 'Required'
        },
        {
            type: 'list',
            name: 'domain',
            message: 'What domain is this?',
            choices: [
                'Technology/Infrastructure',
                'Product/Feature',
                'Data/Migration',
                'People/Hiring',
                'Finance/Pricing',
                'Legal/Compliance',
                'Vendor/Partnership',
                'Other'
            ]
        }
    ]);

    // AI Suggestions (simulated - in production, would call LLM)
    console.log(chalk.green('\n🤖 AI Analysis...\n'));

    const suggestions = getDomainSuggestions(domain, decision);

    console.log(chalk.bold('📋 AI Suggestions:\n'));
    console.log(chalk.dim('  Comparable decisions:'));
    suggestions.comparables.forEach(c => {
        console.log(chalk.dim(`    • ${c}`));
    });

    console.log(chalk.dim('\n  Common irreversibility triggers:'));
    suggestions.triggers.forEach(t => {
        console.log(chalk.dim(`    ⚠️  ${t}`));
    });

    console.log(chalk.dim('\n  Suggested signals to watch:'));
    suggestions.signals.forEach(s => {
        console.log(chalk.dim(`    📊 ${s}`));
    });

    // Human validates and adjusts
    console.log(chalk.yellow('\n📝 Please validate and adjust:\n'));

    let totalScore = 0;
    const scores = {};

    for (const q of ASSESSMENT_QUESTIONS) {
        // Show AI suggestion for each
        const suggested = suggestions.scoreSuggestions[q.id] || 1;

        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'score',
                message: `${q.question} ${chalk.dim(`(AI suggests: ${q.options[suggested].label})`)}`,
                choices: q.options.map((opt, idx) => ({
                    name: `${opt.label} ${chalk.dim(`(+${opt.score})`)}`,
                    value: opt.score
                })),
                default: suggested
            }
        ]);

        scores[q.id] = answer.score;
        totalScore += answer.score;
    }

    const level = scoreToLevel(totalScore);
    const levelInfo = RAMP_LEVELS[level];
    const signal = levelToSignal(level);

    // Get rollback info
    const { owner, method } = await inquirer.prompt([
        {
            type: 'input',
            name: 'owner',
            message: 'Rollback Owner:',
            validate: i => i.length > 0 || 'Required'
        },
        {
            type: 'list',
            name: 'method',
            message: `Rollback Method ${chalk.dim('(AI suggests: ' + suggestions.rollbackMethod + ')')}:`,
            choices: [
                'Feature flag off',
                'Code revert',
                'Database restore',
                suggestions.rollbackMethod,
                'Other'
            ]
        }
    ]);

    // Final output
    console.log(boxen(
        `${chalk.bold.green('🤝 SUPPORTED MVR COMPLETE')}\n\n` +
        `${chalk.bold('Decision:')} ${decision}\n` +
        `${chalk.bold('Domain:')} ${domain}\n\n` +
        `${chalk.bold('RAMP Score:')} ${chalk[levelInfo.color].bold(totalScore + '/100')} → ${levelInfo.emoji} ${chalk[levelInfo.color].bold(level)}\n\n` +
        `${chalk.bold('Rollback Owner:')} ${owner}\n` +
        `${chalk.bold('Method:')} ${method}\n\n` +
        `${chalk.bold(signal.signal)} → ${signal.action}`,
        {
            padding: 1,
            margin: 1,
            borderStyle: 'double',
            borderColor: levelInfo.color
        }
    ));

    if (level === 'L4' || level === 'L5') {
        console.log(chalk.red('\n⚠️  Consider: ramp mvr --mode enterprise for formal governance\n'));
    }

    return { mode: 'supported', decision, score: totalScore, level, owner, domain };
}

function getDomainSuggestions(domain, decision) {
    // Domain-specific suggestions (in production, would use AI)
    const suggestions = {
        'Technology/Infrastructure': {
            comparables: [
                'Database migration (typically L3-L4)',
                'Cloud provider switch (typically L4)',
                'API version upgrade (typically L2-L3)'
            ],
            triggers: [
                'Old system decommissioned',
                'Data deleted or overwritten',
                'Certificates expired'
            ],
            signals: [
                'Error rate > 1%',
                'Latency p99 > 500ms',
                'Failed health checks'
            ],
            rollbackMethod: 'Parallel run + cutover',
            scoreSuggestions: { undo24h: 1, additive: 1, blastRadius: 1, rollbackKnown: 1, detection: 0 }
        },
        'Product/Feature': {
            comparables: [
                'Feature flag rollout (typically L1-L2)',
                'UI redesign (typically L2-L3)',
                'Pricing page change (typically L3-L4)'
            ],
            triggers: [
                'Users took irreversible actions',
                'Promises made publicly',
                'Integrations built by customers'
            ],
            signals: [
                'Conversion rate delta',
                'Support ticket spike',
                'NPS change'
            ],
            rollbackMethod: 'Feature flag off',
            scoreSuggestions: { undo24h: 0, additive: 0, blastRadius: 1, rollbackKnown: 0, detection: 0 }
        },
        'Data/Migration': {
            comparables: [
                'Schema migration (typically L3)',
                'Data backfill (typically L2-L3)',
                'ETL pipeline change (typically L2)'
            ],
            triggers: [
                'Old data deleted',
                'Schema incompatible with rollback',
                'Downstream systems updated'
            ],
            signals: [
                'Data validation errors',
                'Query performance degradation',
                'Missing records count'
            ],
            rollbackMethod: 'Database restore from backup',
            scoreSuggestions: { undo24h: 1, additive: 2, blastRadius: 1, rollbackKnown: 1, detection: 0 }
        },
        default: {
            comparables: [
                'Similar decisions in your history (run: ramp history)',
                'Check RAMP Card Library for comparable'
            ],
            triggers: [
                'Contracts signed',
                'Public announcements made',
                'Money transferred'
            ],
            signals: [
                'Define based on decision type',
                'Check DOORS principles'
            ],
            rollbackMethod: 'TBD based on decision type',
            scoreSuggestions: { undo24h: 1, additive: 1, blastRadius: 1, rollbackKnown: 1, detection: 1 }
        }
    };

    return suggestions[domain] || suggestions.default;
}

// ════════════════════════════════════════════════════════════════
// ENTERPRISE MODE: The "RAMP Brief" (30-45 min, formal governance)
// ════════════════════════════════════════════════════════════════

export async function mvrEnterprise(description) {
    console.log(boxen(
        `${chalk.magenta.bold('🏛️ ENTERPRISE MVR: RAMP Brief')}\n` +
        `${chalk.dim('30-45 minutes • Formal governance with sign-offs')}`,
        { padding: 1, borderColor: 'magenta' }
    ));

    // Formal recognition
    console.log(chalk.bold.magenta('\n═══ RECOGNIZE (5 min) ═══\n'));

    const recognition = await inquirer.prompt([
        {
            type: 'input',
            name: 'decision',
            message: 'Decision Statement:',
            default: description,
            validate: i => i.length > 0 || 'Required'
        },
        {
            type: 'input',
            name: 'sponsor',
            message: 'Executive Sponsor:',
            validate: i => i.length > 0 || 'Required'
        },
        {
            type: 'input',
            name: 'rampOwner',
            message: 'RAMP Owner:',
            validate: i => i.length > 0 || 'Required'
        },
        {
            type: 'checkbox',
            name: 'stakeholders',
            message: 'Stakeholders Affected:',
            choices: [
                'Customers',
                'Employees',
                'Investors',
                'Regulators',
                'Partners',
                'Public'
            ]
        },
        {
            type: 'confirm',
            name: 'hasRegulatory',
            message: 'Are there regulatory implications?',
            default: false
        }
    ]);

    if (recognition.hasRegulatory) {
        console.log(chalk.red('\n⚠️  Regulatory implications detected. Legal review required.\n'));
    }

    // Cross-functional assessment
    console.log(chalk.bold.magenta('\n═══ ASSESS (10 min) ═══'));
    console.log(chalk.dim('Cross-functional panel scoring\n'));

    const functions = ['Legal', 'Finance', 'Technical'];
    const crossFunctionalScores = {};

    for (const func of functions) {
        console.log(chalk.bold(`\n${func} Assessment:\n`));

        let funcScore = 0;
        for (const q of ASSESSMENT_QUESTIONS) {
            const answer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'score',
                    message: `[${func}] ${q.question}`,
                    choices: q.options.map(opt => ({
                        name: `${opt.label} ${chalk.dim(`(+${opt.score})`)}`,
                        value: opt.score
                    }))
                }
            ]);
            funcScore += answer.score;
        }
        crossFunctionalScores[func] = funcScore;
        console.log(chalk.dim(`  ${func} subtotal: ${funcScore}/100`));
    }

    // Composite score
    const compositeScore = Math.round(
        Object.values(crossFunctionalScores).reduce((a, b) => a + b, 0) / functions.length
    );
    const level = scoreToLevel(compositeScore);
    const levelInfo = RAMP_LEVELS[level];
    const signal = levelToSignal(level);

    // Formal containment mapping
    console.log(chalk.bold.magenta('\n═══ MAP (10 min) ═══\n'));

    const containment = await inquirer.prompt([
        {
            type: 'input',
            name: 'primaryOwner',
            message: 'Rollback Owner (Primary):',
            validate: i => i.length > 0 || 'Required'
        },
        {
            type: 'input',
            name: 'backupOwner',
            message: 'Rollback Owner (Backup):',
            validate: i => i.length > 0 || 'Required'
        },
        {
            type: 'input',
            name: 'escalationPath',
            message: 'Escalation Path (→ to executive):',
            validate: i => i.length > 0 || 'Required'
        },
        {
            type: 'input',
            name: 'rollbackMethod',
            message: 'Rollback Method:',
            validate: i => i.length > 0 || 'Required'
        },
        {
            type: 'confirm',
            name: 'rollbackTested',
            message: 'Is rollback mechanism tested?',
            default: false
        },
        {
            type: 'input',
            name: 'killSignal1',
            message: 'Kill Signal 1 (metric > threshold):',
            validate: i => i.length > 0 || 'Required'
        },
        {
            type: 'input',
            name: 'killSignal2',
            message: 'Kill Signal 2 (optional):',
        }
    ]);

    if (!containment.rollbackTested) {
        console.log(chalk.red('\n⚠️  Rollback not tested. This should be scheduled before proceeding.\n'));
    }

    // Position and sign-offs
    console.log(chalk.bold.magenta('\n═══ POSITION & SIGN-OFFS (5 min) ═══\n'));

    // Summary before sign-off
    console.log(boxen(
        `${chalk.bold('RAMP Brief Summary')}\n\n` +
        `${chalk.bold('Decision:')} ${recognition.decision}\n` +
        `${chalk.bold('Sponsor:')} ${recognition.sponsor}\n` +
        `${chalk.bold('RAMP Owner:')} ${recognition.rampOwner}\n\n` +
        `${chalk.bold('Cross-Functional Scores:')}\n` +
        functions.map(f => `  ${f}: ${crossFunctionalScores[f]}/100`).join('\n') + '\n\n' +
        `${chalk.bold('Composite Score:')} ${compositeScore}/100 → ${levelInfo.emoji} ${level}\n\n` +
        `${chalk.bold('Containment:')}\n` +
        `  Primary Owner: ${containment.primaryOwner}\n` +
        `  Backup Owner: ${containment.backupOwner}\n` +
        `  Escalation: ${containment.escalationPath}\n` +
        `  Method: ${containment.rollbackMethod}\n` +
        `  Tested: ${containment.rollbackTested ? '✓' : '✗'}`,
        { padding: 1, borderColor: 'magenta' }
    ));

    // Collect sign-offs
    const signoffs = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'rampOwnerApproved',
            message: `RAMP Owner (${recognition.rampOwner}) approves?`,
            default: true
        },
        {
            type: 'confirm',
            name: 'legalApproved',
            message: 'Legal approves?',
            default: true,
            when: () => recognition.hasRegulatory
        },
        {
            type: 'confirm',
            name: 'sponsorApproved',
            message: `Executive Sponsor (${recognition.sponsor}) approves?`,
            default: true
        }
    ]);

    const allApproved = Object.values(signoffs).every(v => v === true);

    // Final position
    let position;
    if (!allApproved) {
        position = '🔴 HALT — Missing approvals';
    } else if (level === 'L4' || level === 'L5') {
        position = '🟡 PROCEED TO FULL RAMPKIT';
    } else {
        position = '🟢 PROCEED with enhanced monitoring';
    }

    // Generate formal brief output
    const briefContent = generateEnterpriseBrief({
        recognition,
        crossFunctionalScores,
        compositeScore,
        level,
        containment,
        signoffs,
        position
    });

    console.log(boxen(
        `${chalk.bold.magenta('🏛️ ENTERPRISE MVR COMPLETE')}\n\n` +
        `${chalk.bold('Composite Score:')} ${chalk[levelInfo.color].bold(compositeScore + '/100')} → ${levelInfo.emoji} ${level}\n\n` +
        `${chalk.bold('Sign-offs:')}\n` +
        `  RAMP Owner: ${signoffs.rampOwnerApproved ? '✓' : '✗'}\n` +
        (recognition.hasRegulatory ? `  Legal: ${signoffs.legalApproved ? '✓' : '✗'}\n` : '') +
        `  Sponsor: ${signoffs.sponsorApproved ? '✓' : '✗'}\n\n` +
        `${chalk.bold('Position:')} ${position}`,
        {
            padding: 1,
            margin: 1,
            borderStyle: 'double',
            borderColor: allApproved ? levelInfo.color : 'red'
        }
    ));

    // Save brief
    const result = {
        mode: 'enterprise',
        ...recognition,
        crossFunctionalScores,
        compositeScore,
        level,
        containment,
        signoffs,
        position,
        brief: briefContent,
        timestamp: new Date().toISOString()
    };

    const { exportBrief } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'exportBrief',
            message: 'Export RAMP Brief to Markdown?',
            default: true
        }
    ]);

    if (exportBrief) {
        const filename = `RAMP-Brief-${new Date().toISOString().split('T')[0]}.md`;
        const fs = await import('fs');
        fs.writeFileSync(filename, briefContent);
        console.log(chalk.green(`\n✓ Brief exported: ${filename}\n`));
    }

    return result;
}

function generateEnterpriseBrief(data) {
    return `# Enterprise RAMP Brief

**Date**: ${new Date().toISOString()}
**RAMP Owner**: ${data.recognition.rampOwner}
**Executive Sponsor**: ${data.recognition.sponsor}

---

## R: Recognition

**Decision Statement**: ${data.recognition.decision}

**Stakeholders Affected**:
${data.recognition.stakeholders.map(s => `- [x] ${s}`).join('\n')}

**Regulatory Implications**: ${data.recognition.hasRegulatory ? 'Yes — requires Legal review' : 'No'}

---

## A: Assessment

### Cross-Functional Scores

| Function | Score |
|----------|-------|
| Legal | ${data.crossFunctionalScores.Legal}/100 |
| Finance | ${data.crossFunctionalScores.Finance}/100 |
| Technical | ${data.crossFunctionalScores.Technical}/100 |
| **Composite** | **${data.compositeScore}/100** |

**RAMP Level**: ${data.level}

---

## M: Map

**Rollback Owner (Primary)**: ${data.containment.primaryOwner}
**Rollback Owner (Backup)**: ${data.containment.backupOwner}
**Escalation Path**: ${data.containment.escalationPath}

**Rollback Method**: ${data.containment.rollbackMethod}
**Rollback Tested**: ${data.containment.rollbackTested ? '✓ Yes' : '✗ No — SCHEDULE BEFORE PROCEEDING'}

**Kill Signals**:
1. ${data.containment.killSignal1}
${data.containment.killSignal2 ? `2. ${data.containment.killSignal2}` : ''}

---

## P: Position

**Outcome**: ${data.position}

### Sign-offs

| Role | Name | Approved | Date |
|------|------|----------|------|
| RAMP Owner | ${data.recognition.rampOwner} | ${data.signoffs.rampOwnerApproved ? '✓' : '✗'} | ${new Date().toISOString().split('T')[0]} |
| Executive Sponsor | ${data.recognition.sponsor} | ${data.signoffs.sponsorApproved ? '✓' : '✗'} | ${new Date().toISOString().split('T')[0]} |

---

> "Move fast on two-way doors. Slow down on one-way doors."

Generated by RAMP-KIT v2.0
`;
}
