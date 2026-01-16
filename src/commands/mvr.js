/**
 * MVR Command - Minimum Viable RAMP (15-minute protocol)
 * 
 * The rapid 4-step reversibility assessment:
 * R → A → M → P (without the KIT governance overhead)
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import { saveDecision, generateId } from '../lib/storage.js';

// MVR Banner
const mvrBanner = `
${chalk.yellow.bold('⚡ MVR: Minimum Viable RAMP')}
${chalk.dim('15-minute rapid reversibility assessment')}
${chalk.dim('"80% of insight in 20% of the time"')}
`;

// The 5 assessment questions with scoring
const assessmentQuestions = [
    {
        id: 'undo24h',
        question: 'Can we undo this within 24 hours?',
        options: [
            { label: 'Yes - easily reversible', score: 30 },
            { label: 'Partial - some effort required', score: 15 },
            { label: 'No - significant time/effort', score: 0 }
        ]
    },
    {
        id: 'additive',
        question: 'Is this additive (not destructive)?',
        options: [
            { label: 'Yes - adding, not removing', score: 25 },
            { label: 'Partial - modifying existing', score: 15 },
            { label: 'No - removing/replacing', score: 0 }
        ]
    },
    {
        id: 'blastRadius',
        question: 'Can we limit who/what is affected?',
        options: [
            { label: 'Yes - can stage or limit', score: 20 },
            { label: 'Partial - some control', score: 10 },
            { label: 'No - affects everything', score: 0 }
        ]
    },
    {
        id: 'rollbackKnown',
        question: 'Do we know how to rollback?',
        options: [
            { label: 'Yes - tested rollback plan', score: 15 },
            { label: 'Partial - plan exists, untested', score: 10 },
            { label: 'No - unclear how to undo', score: 0 }
        ]
    },
    {
        id: 'detection',
        question: 'Will we know if it\'s broken fast?',
        options: [
            { label: 'Yes - monitoring in place', score: 10 },
            { label: 'Partial - some signals', score: 5 },
            { label: 'No - might not notice', score: 0 }
        ]
    }
];

// Score to Level mapping
function scoreToLevel(score) {
    if (score >= 90) return { level: 'L1', name: 'Instant', color: 'green', emoji: '⚡' };
    if (score >= 70) return { level: 'L2', name: 'Rapid', color: 'green', emoji: '🔄' };
    if (score >= 50) return { level: 'L3', name: 'Planned', color: 'yellow', emoji: '📋' };
    if (score >= 30) return { level: 'L4', name: 'Effortful', color: 'red', emoji: '⚠️' };
    return { level: 'L5', name: 'Irreversible', color: 'magenta', emoji: '🚫' };
}

// Level to traffic light
function levelToSignal(level) {
    if (level === 'L1' || level === 'L2') {
        return { signal: '🟢 GREEN', action: 'RAMP DOWN', message: 'Ship it now' };
    }
    if (level === 'L3') {
        return { signal: '🟡 YELLOW', action: 'RAMP CAREFULLY', message: 'Ship with monitoring' };
    }
    return { signal: '🔴 RED', action: 'RAMP UP', message: 'Stop and escalate to full RAMPKIT' };
}

export async function mvrCommand(description, options) {
    console.log(mvrBanner);

    const startTime = Date.now();
    const results = {
        id: generateId(),
        type: 'mvr',
        timestamp: new Date().toISOString()
    };

    // ═══════════════════════════════════════════════════════════
    // STEP 1: RECOGNIZE (2 minutes)
    // ═══════════════════════════════════════════════════════════
    console.log(boxen(
        `${chalk.bold.cyan('STEP 1: RECOGNIZE')} ${chalk.dim('(2 min)')}\n` +
        `${chalk.dim('"What are we shipping?"')}`,
        { padding: 1, borderStyle: 'round', borderColor: 'cyan' }
    ));

    let decisionStatement;

    if (description) {
        decisionStatement = description;
        console.log(chalk.dim(`Decision: ${description}`));
    } else {
        const recognizeAnswers = await inquirer.prompt([
            {
                type: 'input',
                name: 'action',
                message: 'What action are you taking?',
                validate: (input) => input.length > 0 || 'Please describe the action'
            },
            {
                type: 'input',
                name: 'scope',
                message: 'Who/what is affected?',
                validate: (input) => input.length > 0 || 'Please describe the scope'
            },
            {
                type: 'input',
                name: 'timeline',
                message: 'Starting when?',
                default: 'now'
            }
        ]);

        decisionStatement = `${recognizeAnswers.action} affecting ${recognizeAnswers.scope} starting ${recognizeAnswers.timeline}`;
    }

    results.decision = decisionStatement;
    console.log(chalk.green(`\n✓ Decision: "${decisionStatement}"\n`));

    // ═══════════════════════════════════════════════════════════
    // STEP 2: ASSESS (5 minutes)
    // ═══════════════════════════════════════════════════════════
    console.log(boxen(
        `${chalk.bold.cyan('STEP 2: ASSESS')} ${chalk.dim('(5 min)')}\n` +
        `${chalk.dim('"How reversible is it?"')}`,
        { padding: 1, borderStyle: 'round', borderColor: 'cyan' }
    ));

    let totalScore = 0;
    const scores = {};

    for (const q of assessmentQuestions) {
        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'score',
                message: q.question,
                choices: q.options.map(opt => ({
                    name: `${opt.label} ${chalk.dim(`(+${opt.score})`)}`,
                    value: opt.score
                }))
            }
        ]);

        scores[q.id] = answer.score;
        totalScore += answer.score;
    }

    results.score = totalScore;
    results.scores = scores;

    const levelInfo = scoreToLevel(totalScore);
    results.level = levelInfo.level;

    console.log(boxen(
        `${chalk.bold('RAMP Score:')} ${chalk[levelInfo.color].bold(totalScore + '/100')}\n` +
        `${chalk.bold('RAMP Level:')} ${levelInfo.emoji} ${chalk[levelInfo.color].bold(levelInfo.level)} (${levelInfo.name})`,
        { padding: 1, borderStyle: 'round', borderColor: levelInfo.color }
    ));

    // ═══════════════════════════════════════════════════════════
    // STEP 3: MAP (5 minutes)
    // ═══════════════════════════════════════════════════════════
    console.log(boxen(
        `${chalk.bold.cyan('STEP 3: MAP')} ${chalk.dim('(5 min)')}\n` +
        `${chalk.dim('"What if it fails?"')}`,
        { padding: 1, borderStyle: 'round', borderColor: 'cyan' }
    ));

    const mapAnswers = await inquirer.prompt([
        {
            type: 'input',
            name: 'rollbackOwner',
            message: 'Rollback Owner (who fixes it if it fails)?',
            validate: (input) => input.length > 0 || 'Rollback owner is required'
        },
        {
            type: 'list',
            name: 'rollbackMethod',
            message: 'Rollback Method:',
            choices: [
                'Feature flag off',
                'Code revert',
                'Database restore',
                'Manual cleanup',
                'Other'
            ],
            when: () => levelInfo.level !== 'L1'
        },
        {
            type: 'input',
            name: 'killSignal',
            message: 'Kill Signal (metric that tells us to stop)?',
            when: () => levelInfo.level === 'L4' || levelInfo.level === 'L5'
        }
    ]);

    results.rollbackOwner = mapAnswers.rollbackOwner;
    results.rollbackMethod = mapAnswers.rollbackMethod;
    results.killSignal = mapAnswers.killSignal;

    console.log(chalk.green(`\n✓ Rollback Owner: ${mapAnswers.rollbackOwner}`));
    if (mapAnswers.rollbackMethod) {
        console.log(chalk.green(`✓ Method: ${mapAnswers.rollbackMethod}`));
    }
    if (mapAnswers.killSignal) {
        console.log(chalk.green(`✓ Kill Signal: ${mapAnswers.killSignal}`));
    }
    console.log();

    // ═══════════════════════════════════════════════════════════
    // STEP 4: POSITION (3 minutes)
    // ═══════════════════════════════════════════════════════════
    console.log(boxen(
        `${chalk.bold.cyan('STEP 4: POSITION')} ${chalk.dim('(3 min)')}\n` +
        `${chalk.dim('"Ship or Stop?"')}`,
        { padding: 1, borderStyle: 'round', borderColor: 'cyan' }
    ));

    const signalInfo = levelToSignal(levelInfo.level);
    results.signal = signalInfo.signal;
    results.action = signalInfo.action;

    const elapsedMs = Date.now() - startTime;
    const elapsedMin = Math.round(elapsedMs / 60000);

    // Final output
    const summaryBox = boxen(
        `${chalk.bold.white('⚡ MVR ASSESSMENT COMPLETE')}\n\n` +
        `${chalk.bold('Decision:')} ${decisionStatement}\n\n` +
        `${chalk.bold('RAMP Score:')} ${chalk[levelInfo.color].bold(totalScore + '/100')} → ${levelInfo.emoji} ${chalk[levelInfo.color].bold(levelInfo.level)}\n\n` +
        `${chalk.bold('Rollback Owner:')} ${mapAnswers.rollbackOwner}\n` +
        (mapAnswers.rollbackMethod ? `${chalk.bold('Method:')} ${mapAnswers.rollbackMethod}\n` : '') +
        (mapAnswers.killSignal ? `${chalk.bold('Kill Signal:')} ${mapAnswers.killSignal}\n` : '') +
        `\n${chalk.bold('Signal:')} ${signalInfo.signal}\n` +
        `${chalk.bold('Action:')} ${chalk.bold(signalInfo.action)} — ${signalInfo.message}\n\n` +
        `${chalk.dim(`Completed in ${elapsedMin || '<1'} minute(s)`)}`,
        {
            padding: 1,
            margin: 1,
            borderStyle: 'double',
            borderColor: levelInfo.color,
            title: '📋 MVR Result',
            titleAlignment: 'center'
        }
    );

    console.log(summaryBox);

    // Show escalation warning if needed
    if (levelInfo.level === 'L4' || levelInfo.level === 'L5') {
        console.log(boxen(
            `${chalk.red.bold('⚠️  ESCALATION REQUIRED')}\n\n` +
            `${levelInfo.level} decisions require full RAMPKIT protocol.\n\n` +
            `Run: ${chalk.cyan('ramp-kit start')} for full 7-step assessment`,
            {
                padding: 1,
                borderStyle: 'round',
                borderColor: 'red',
                title: '🚨 Action Required',
                titleAlignment: 'center'
            }
        ));
    }

    // Save decision
    try {
        await saveDecision(results);
        console.log(chalk.dim(`\nDecision saved. View with: ramp-kit history`));
    } catch (err) {
        // Storage might not be available, that's OK
    }

    return results;
}

// Quick MVR for Personal mode (non-interactive)
export async function quickMvr(description) {
    console.log(chalk.yellow.bold('\n⚡ Quick MVR Check\n'));

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'canUndo',
            message: `"${description}" — Can you undo this in an hour yourself?`,
            choices: [
                { name: '✅ Yes, easily', value: 'green' },
                { name: '🟡 Mostly, with some effort', value: 'yellow' },
                { name: '❌ No, would need help/time', value: 'red' }
            ]
        }
    ]);

    if (answer.canUndo === 'green') {
        console.log(boxen(
            `${chalk.green.bold('🟢 RAMP DOWN — Ship it!')}`,
            { padding: 1, borderColor: 'green' }
        ));
    } else if (answer.canUndo === 'yellow') {
        console.log(boxen(
            `${chalk.yellow.bold('🟡 RAMP CAREFULLY')}\n` +
            `Ship with monitoring. Run ${chalk.cyan('ramp-kit mvr')} for full assessment.`,
            { padding: 1, borderColor: 'yellow' }
        ));
    } else {
        console.log(boxen(
            `${chalk.red.bold('🔴 RAMP UP — Stop!')}\n` +
            `Run ${chalk.cyan('ramp-kit mvr')} for full MVR or ${chalk.cyan('ramp-kit start')} for RAMPKIT.`,
            { padding: 1, borderColor: 'red' }
        ));
    }
}
