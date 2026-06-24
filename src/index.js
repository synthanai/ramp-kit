#!/usr/bin/env node

/**
 * RAMP-KIT CLI v2.0
 * Reversible Action Management Protocol
 * 
 * Full RAMP Methodology Implementation:
 * - RAMP Levels (L1-L5)
 * - RAMPKIT Protocol (7 steps)
 * - MVR Protocol (4 steps, 15-minute rapid)
 * - DOORS Principles (5 stances)
 * - PHASE Modes (5 deployment contexts)
 * - CLIMBS Patterns (6 advanced)
 * 
 * "Move fast on two-way doors. Slow down on one-way doors."
 * 
 * @author RAMP Development Team
 * @license MIT
 */

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import Table from 'cli-table3';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

// ============================================
// CONFIGURATION
// ============================================

const VERSION = '2.0.0';
const RAMP_DIR = join(homedir(), '.ramp');
const CONFIG_PATH = join(RAMP_DIR, 'config.json');
const DECISIONS_DIR = join(RAMP_DIR, 'decisions');
const CARDS_DIR = join(RAMP_DIR, 'cards');

function ensureDirectories() {
  [RAMP_DIR, DECISIONS_DIR, CARDS_DIR].forEach(dir => {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  });
}

// ============================================
// CONFIG MANAGEMENT
// ============================================

function loadConfig() {
  ensureDirectories();
  if (existsSync(CONFIG_PATH)) {
    try { return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8')); }
    catch { return { phase: 'personal' }; }
  }
  return { phase: 'personal' };
}

function saveConfig(config) {
  ensureDirectories();
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

function getConfig(key) { return loadConfig()[key]; }
function setConfig(key, value) { const c = loadConfig(); c[key] = value; saveConfig(c); }

// ============================================
// DECISION STORAGE
// ============================================

function saveDecision(decision) {
  ensureDirectories();
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const slug = decision.decision?.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'decision';
  const fn = `${ts}_${slug}.json`;
  writeFileSync(join(DECISIONS_DIR, fn), JSON.stringify(decision, null, 2));
  return fn;
}

function listDecisions(limit = 10) {
  ensureDirectories();
  if (!existsSync(DECISIONS_DIR)) return [];
  return readdirSync(DECISIONS_DIR)
    .filter(f => f.endsWith('.json'))
    .sort().reverse().slice(0, limit)
    .map(f => {
      try { return { filename: f, ...JSON.parse(readFileSync(join(DECISIONS_DIR, f), 'utf-8')) }; }
      catch { return { filename: f, error: true }; }
    });
}

function generateId() {
  return `ramp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

// ============================================
// METHODOLOGY DEFINITIONS
// ============================================

const RAMP_LEVELS = {
  L1: { name: 'Instant', time: '<1 hour', action: 'Ship it', color: 'green', emoji: '⚡' },
  L2: { name: 'Rapid', time: '<1 day', action: 'Monitor & Ship', color: 'green', emoji: '🔄' },
  L3: { name: 'Planned', time: '<1 week', action: 'Plan rollback first', color: 'yellow', emoji: '📋' },
  L4: { name: 'Effortful', time: '<1 month', action: 'Require approval', color: 'red', emoji: '⚠️' },
  L5: { name: 'Irreversible', time: 'Permanent', action: 'Full RAMP UP', color: 'magenta', emoji: '🚫' }
};

const RAMPKIT_PROTOCOL = {
  R: { letter: 'R', name: 'RECOGNIZE', question: 'What are we doing?', output: 'Decision statement' },
  A: { letter: 'A', name: 'ASSESS', question: 'How reversible is it?', output: 'RAMP Score (0-100)' },
  M: { letter: 'M', name: 'MAP', question: 'What\'s the containment plan?', output: 'Rollback plan & signals' },
  P: { letter: 'P', name: 'POSITION', question: 'RAMP UP or RAMP DOWN?', output: 'Direction decision' },
  K: { letter: 'K', name: 'KICKOFF', question: 'Who owns this?', output: 'RAMP Card' },
  I: { letter: 'I', name: 'INSPECT', question: 'Are signals nominal?', output: 'Checkpoint reviews' },
  T: { letter: 'T', name: 'TRACK', question: 'What did we learn?', output: 'Decision record' }
};

const DOORS_PRINCIPLES = {
  D: { letter: 'D', name: 'DECLARE', check: 'Is the reversibility classification explicit?', timing: 'Before shipping' },
  O1: { letter: 'O', name: 'OBSERVE', check: 'Are signals in place to detect problems?', timing: 'During execution' },
  O2: { letter: 'O', name: 'OWN', check: 'Is there a named rollback owner?', timing: 'Before shipping' },
  R: { letter: 'R', name: 'READY', check: 'Is the rollback mechanism tested?', timing: 'Before shipping' },
  S: { letter: 'S', name: 'SIGNAL', check: 'Do we have quantitative tripwires?', timing: 'During execution' }
};

const PHASE_MODES = {
  personal: { name: 'Personal', who: 'Individual', speed: 'Fastest', icon: '👤' },
  huddle: { name: 'Huddle', who: 'Team', speed: 'Fast', icon: '👥' },
  automated: { name: 'Automated', who: 'Pipeline', speed: 'Instant', icon: '🤖' },
  supported: { name: 'Supported', who: 'Human + AI', speed: 'Medium', icon: '🤝' },
  enterprise: { name: 'Enterprise', who: 'Governance', speed: 'Slowest', icon: '🏛️' }
};

const CLIMBS_PATTERNS = {
  C: { letter: 'C', name: 'Checkpoint Cascade', use: 'Progressive rollout with gates' },
  L: { letter: 'L', name: 'Lock-in Detection', use: 'Identify points of no return' },
  I: { letter: 'I', name: 'Inverse RAMP', use: 'When NOT shipping is the risk' },
  M: { letter: 'M', name: 'Momentum Brake', use: 'Confidence check when scope creeps' },
  B: { letter: 'B', name: 'Blast Radius Mapping', use: 'Quantify affected systems/users' },
  S: { letter: 'S', name: 'Staged Commitment', use: 'Incremental investment gates' }
};

const ASSESSMENT_QUESTIONS = [
  {
    id: 'undo24h', question: 'Can we undo this within 24 hours?', options: [
      { label: 'Yes - easily reversible', score: 30 },
      { label: 'Partial - some effort required', score: 15 },
      { label: 'No - significant time/effort', score: 0 }
    ]
  },
  {
    id: 'additive', question: 'Is this additive (not destructive)?', options: [
      { label: 'Yes - adding, not removing', score: 25 },
      { label: 'Partial - modifying existing', score: 15 },
      { label: 'No - removing/replacing', score: 0 }
    ]
  },
  {
    id: 'blastRadius', question: 'Can we limit who/what is affected?', options: [
      { label: 'Yes - can stage or limit', score: 20 },
      { label: 'Partial - some control', score: 10 },
      { label: 'No - affects everything', score: 0 }
    ]
  },
  {
    id: 'rollbackKnown', question: 'Do we know how to rollback?', options: [
      { label: 'Yes - tested rollback plan', score: 15 },
      { label: 'Partial - plan exists, untested', score: 10 },
      { label: 'No - unclear how to undo', score: 0 }
    ]
  },
  {
    id: 'detection', question: 'Will we know if it\'s broken fast?', options: [
      { label: 'Yes - monitoring in place', score: 10 },
      { label: 'Partial - some signals', score: 5 },
      { label: 'No - might not notice', score: 0 }
    ]
  }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

function scoreToLevel(score) {
  if (score >= 90) return 'L1';
  if (score >= 70) return 'L2';
  if (score >= 50) return 'L3';
  if (score >= 30) return 'L4';
  return 'L5';
}

function levelToSignal(level) {
  if (level === 'L1' || level === 'L2') {
    return { signal: '🟢 GREEN', action: 'RAMP DOWN', message: 'Ship it now' };
  }
  if (level === 'L3') {
    return { signal: '🟡 YELLOW', action: 'RAMP CAREFULLY', message: 'Ship with monitoring' };
  }
  return { signal: '🔴 RED', action: 'RAMP UP', message: 'Stop and escalate' };
}

// ============================================
// UI COMPONENTS
// ============================================

function printBanner() {
  console.log(chalk.cyan.bold(`
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   ██████╗  █████╗ ███╗   ███╗██████╗                                 ║
║   ██╔══██╗██╔══██╗████╗ ████║██╔══██╗                                ║
║   ██████╔╝███████║██╔████╔██║██████╔╝    ${chalk.white('v' + VERSION)}                       ║
║   ██╔══██╗██╔══██║██║╚██╔╝██║██╔═══╝                                 ║
║   ██║  ██║██║  ██║██║ ╚═╝ ██║██║                                     ║
║   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝                                     ║
║                                                                       ║
║   ${chalk.dim('Reversible Action Management Protocol')}                             ║
║   ${chalk.yellow('"Can we undo this?"')}                                              ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
    `));
}

function printMvrBanner() {
  console.log(chalk.yellow.bold(`
┌─────────────────────────────────────────────────────────────┐
│               ⚡ MVR: Minimum Viable RAMP                    │
│                  15-minute rapid assessment                 │
│              "80% of insight in 20% of the time"            │
└─────────────────────────────────────────────────────────────┘
    `));
}

// ============================================
// MVR COMMAND (15-minute rapid protocol)
// ============================================

async function mvrCommand(description, options) {
  printMvrBanner();

  const startTime = Date.now();
  const results = {
    id: generateId(),
    type: 'mvr',
    timestamp: new Date().toISOString(),
    phase: getConfig('phase') || 'personal'
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

  for (const q of ASSESSMENT_QUESTIONS) {
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

  const level = scoreToLevel(totalScore);
  const levelInfo = RAMP_LEVELS[level];
  results.level = level;

  console.log(boxen(
    `${chalk.bold('RAMP Score:')} ${chalk[levelInfo.color].bold(totalScore + '/100')}\n` +
    `${chalk.bold('RAMP Level:')} ${levelInfo.emoji} ${chalk[levelInfo.color].bold(level)} (${levelInfo.name})`,
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
      when: () => level !== 'L1'
    },
    {
      type: 'input',
      name: 'killSignal',
      message: 'Kill Signal (metric > threshold that tells us to stop)?',
      when: () => level === 'L4' || level === 'L5'
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

  const signalInfo = levelToSignal(level);
  results.signal = signalInfo.signal;
  results.action = signalInfo.action;

  const elapsedMs = Date.now() - startTime;
  const elapsedMin = Math.round(elapsedMs / 60000);

  // Final output
  const summaryBox = boxen(
    `${chalk.bold.white('⚡ MVR ASSESSMENT COMPLETE')}\n\n` +
    `${chalk.bold('Decision:')} ${decisionStatement}\n\n` +
    `${chalk.bold('RAMP Score:')} ${chalk[levelInfo.color].bold(totalScore + '/100')} → ${levelInfo.emoji} ${chalk[levelInfo.color].bold(level)}\n\n` +
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
  if (level === 'L4' || level === 'L5') {
    console.log(boxen(
      `${chalk.red.bold('⚠️  ESCALATION REQUIRED')}\n\n` +
      `${level} decisions require full RAMPKIT protocol.\n\n` +
      `Run: ${chalk.cyan('ramp start')} for full 7-step assessment`,
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
    const savedFile = saveDecision(results);
    console.log(chalk.dim(`\nDecision saved: ~/.ramp/decisions/${savedFile}`));
    console.log(chalk.dim(`View history: ramp history`));
  } catch (err) {
    // Storage might not be available, that's OK
  }

  return results;
}

// ============================================
// QUICK MVR (3-second screen for Personal mode)
// ============================================

async function quickMvrCommand(description) {
  console.log(chalk.yellow.bold('\n⚡ Quick MVR (Personal Mode)\n'));

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'canUndo',
      message: description
        ? `"${description}" — Can you undo this in an hour yourself?`
        : 'Can you undo this in an hour yourself?',
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
      `Ship with monitoring. Run ${chalk.cyan('ramp mvr')} for full assessment.`,
      { padding: 1, borderColor: 'yellow' }
    ));
  } else {
    console.log(boxen(
      `${chalk.red.bold('🔴 RAMP UP — Stop!')}\n` +
      `Run ${chalk.cyan('ramp mvr')} for full MVR or ${chalk.cyan('ramp start')} for RAMPKIT.`,
      { padding: 1, borderColor: 'red' }
    ));
  }
}

// ============================================
// METHODOLOGY DISPLAY COMMANDS
// ============================================

function showLevels() {
  printBanner();
  console.log(chalk.bold.cyan('\n📊 RAMP Levels\n'));

  const table = new Table({
    head: ['Level', 'Name', 'Reversal Time', 'Action'].map(h => chalk.bold(h)),
    style: { head: [], border: [] }
  });

  Object.entries(RAMP_LEVELS).forEach(([level, info]) => {
    table.push([
      chalk[info.color](`${info.emoji} ${level}`),
      info.name,
      info.time,
      info.action
    ]);
  });

  console.log(table.toString());
  console.log(chalk.dim('\nScore mapping: 90-100=L1 | 70-89=L2 | 50-69=L3 | 30-49=L4 | 0-29=L5\n'));
}

function showProtocol() {
  printBanner();
  console.log(chalk.bold.cyan('\n📜 RAMPKIT Protocol (7 Steps)\n'));

  Object.values(RAMPKIT_PROTOCOL).forEach(step => {
    console.log(`  ${chalk.cyan.bold(step.letter)} — ${chalk.bold(step.name)}`);
    console.log(`      ${chalk.dim('Question:')} "${step.question}"`);
    console.log(`      ${chalk.dim('Output:')} ${step.output}\n`);
  });

  console.log(boxen(
    `${chalk.bold('MVR (Minimum Viable RAMP)')}\n\n` +
    `For rapid assessment, use only the first 4 steps:\n` +
    `${chalk.cyan('R → A → M → P')} (15 minutes)\n\n` +
    `Run: ${chalk.cyan('ramp mvr')}`,
    { padding: 1, borderColor: 'yellow' }
  ));
}

function showDoors() {
  printBanner();
  console.log(chalk.bold.yellow('\n🚪 DOORS Principles\n'));

  Object.values(DOORS_PRINCIPLES).forEach(p => {
    console.log(`  ${chalk.yellow.bold(p.letter)} — ${chalk.bold(p.name)}`);
    console.log(`      ${chalk.dim('When:')} ${p.timing}`);
    console.log(`      ${chalk.dim('Check:')} "${p.check}"\n`);
  });
}

function showPhase() {
  printBanner();
  console.log(chalk.bold.magenta('\n🎭 PHASE Modes\n'));

  const table = new Table({
    head: ['Mode', 'Who', 'Speed', 'Best For'].map(h => chalk.bold(h)),
    style: { head: [], border: [] }
  });

  table.push(
    [`${PHASE_MODES.personal.icon} Personal`, 'Individual', 'Fastest', 'Quick decisions, learning'],
    [`${PHASE_MODES.huddle.icon} Huddle`, 'Team', 'Fast', 'Sprint planning'],
    [`${PHASE_MODES.automated.icon} Automated`, 'Pipeline', 'Instant', 'CI/CD gates'],
    [`${PHASE_MODES.supported.icon} Supported`, 'Human + AI', 'Medium', 'Complex assessments'],
    [`${PHASE_MODES.enterprise.icon} Enterprise`, 'Governance', 'Slowest', 'L4-L5, regulated']
  );

  console.log(table.toString());

  const current = getConfig('phase') || 'personal';
  console.log(chalk.dim(`\nCurrent mode: ${chalk.bold(current)}`));
  console.log(chalk.dim(`Change with: ramp config --phase <mode>\n`));
}

function showClimbs() {
  printBanner();
  console.log(chalk.bold.green('\n🧗 CLIMBS Patterns\n'));

  Object.values(CLIMBS_PATTERNS).forEach(p => {
    console.log(`  ${chalk.green.bold(p.letter)} — ${chalk.bold(p.name)}`);
    console.log(`      ${chalk.dim('Use:')} ${p.use}\n`);
  });
}

function showRef() {
  printBanner();
  console.log(boxen(
    `${chalk.bold.cyan('RAMP QUICK REFERENCE')}\n\n` +
    `${chalk.bold('RAMPKIT Protocol:')}\n` +
    `  ${chalk.cyan('R')}ecognize → ${chalk.cyan('A')}ssess → ${chalk.cyan('M')}ap → ${chalk.cyan('P')}osition\n` +
    `  ${chalk.cyan('K')}ickoff → ${chalk.cyan('I')}nspect → ${chalk.cyan('T')}rack\n\n` +
    `${chalk.bold('MVR Protocol (15 min):')}\n` +
    `  ${chalk.yellow('R')}ecognize → ${chalk.yellow('A')}ssess → ${chalk.yellow('M')}ap → ${chalk.yellow('P')}osition\n\n` +
    `${chalk.bold('DOORS Principles:')}\n` +
    `  ${chalk.yellow('D')}eclare → ${chalk.yellow('O')}bserve → ${chalk.yellow('O')}wn → ${chalk.yellow('R')}eady → ${chalk.yellow('S')}ignal\n\n` +
    `${chalk.bold('Direction:')}\n` +
    `  ${chalk.green('RAMP DOWN ▼')} = Can undo → Proceed\n` +
    `  ${chalk.red('RAMP UP ▲')}   = Can't undo → Add rigor\n\n` +
    `${chalk.bold('The Question:')}\n` +
    `  ${chalk.yellow.italic('"Can we undo this?"')}`,
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'yellow',
      title: '📋 Quick Ref',
      titleAlignment: 'center'
    }
  ));
}

// ============================================
// HISTORY & STATUS COMMANDS
// ============================================

function showHistory(options) {
  printBanner();
  console.log(chalk.bold('\n📜 Decision History\n'));

  const limit = parseInt(options.count) || 10;
  const decisions = listDecisions(limit);

  if (decisions.length === 0) {
    console.log(chalk.dim('  No decisions recorded yet.'));
    console.log(chalk.dim('  Run: ramp mvr or ramp start\n'));
    return;
  }

  const table = new Table({
    head: ['Date', 'Type', 'Level', 'Decision'].map(h => chalk.bold(h)),
    style: { head: [], border: [] },
    colWidths: [12, 8, 6, 45]
  });

  decisions.forEach(d => {
    if (d.error) {
      table.push([d.filename, '-', '-', chalk.red('Error loading')]);
    } else {
      const date = d.timestamp?.split('T')[0] || 'Unknown';
      const level = d.level || '-';
      const levelInfo = RAMP_LEVELS[level] || {};
      table.push([
        date,
        d.type?.toUpperCase() || '-',
        levelInfo.emoji ? chalk[levelInfo.color](`${levelInfo.emoji} ${level}`) : level,
        (d.decision || '').substring(0, 42) + '...'
      ]);
    }
  });

  console.log(table.toString());
  console.log(chalk.dim(`\nShowing ${decisions.length} most recent. Files in: ~/.ramp/decisions/\n`));
}

function showStatus() {
  printBanner();
  const config = loadConfig();
  const decisions = listDecisions(5);

  console.log(chalk.bold('\n📊 Status\n'));
  console.log(`  Version:      ${VERSION}`);
  console.log(`  PHASE Mode:   ${config.phase || 'personal'}`);
  console.log(`  Decisions:    ${decisions.length} recent`);
  console.log(`  Config:       ${CONFIG_PATH}`);
  console.log();

  // Show recent
  if (decisions.length > 0) {
    console.log(chalk.bold('Recent Decisions:\n'));
    decisions.slice(0, 3).forEach(d => {
      if (!d.error) {
        const level = d.level || '?';
        const levelInfo = RAMP_LEVELS[level] || {};
        const emoji = levelInfo.emoji || '•';
        console.log(`  ${emoji} ${d.timestamp?.split('T')[0]}: ${(d.decision || '').substring(0, 50)}...`);
      }
    });
    console.log();
  }
}

async function configCommand(options) {
  if (options.phase) {
    const validModes = Object.keys(PHASE_MODES);
    if (validModes.includes(options.phase)) {
      setConfig('phase', options.phase);
      console.log(chalk.green(`\n✓ PHASE mode set to: ${options.phase}\n`));
    } else {
      console.log(chalk.red(`\nInvalid mode. Choose from: ${validModes.join(', ')}\n`));
    }
    return;
  }

  // Show current config
  const config = loadConfig();
  console.log(chalk.bold('\n⚙️  Configuration\n'));
  console.log(`  PHASE Mode:  ${config.phase || 'personal'}`);
  console.log(`  Config Path: ${CONFIG_PATH}`);
  console.log();
  console.log(chalk.dim('  Set mode: ramp config --phase <mode>'));
  console.log(chalk.dim('  Modes: personal, huddle, automated, supported, enterprise\n'));
}

// ============================================
// MAIN CLI PROGRAM
// ============================================

const program = new Command();

program
  .name('ramp')
  .description('RAMP-KIT: Reversible Action Management Protocol CLI')
  .version(VERSION)
  .addHelpText('before', chalk.cyan.bold(`
   ██████╗  █████╗ ███╗   ███╗██████╗ 
   ██╔══██╗██╔══██╗████╗ ████║██╔══██╗
   ██████╔╝███████║██╔████╔██║██████╔╝   v${VERSION}
   ██╔══██╗██╔══██║██║╚██╔╝██║██╔═══╝ 
   ██║  ██║██║  ██║██║ ╚═╝ ██║██║     
   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝     
   
   ${chalk.dim('Reversible Action Management Protocol')}
   ${chalk.yellow('"Can we undo this?"')}
`));

// MVR - Minimum Viable RAMP with PHASE modes
program
  .command('mvr')
  .description('⚡ MVR: Rapid reversibility assessment (supports all PHASE modes)')
  .argument('[description]', 'Decision description')
  .option('-m, --mode <mode>', 'PHASE mode: personal|huddle|automated|supported|enterprise')
  .option('-q, --quick', 'Quick 3-second screen (Personal mode)')
  .option('--json', 'JSON output (Automated mode)')
  .option('--oneline', 'One-line output (Automated mode)')
  .option('--strict', 'Exit code 1 on BLOCK (Automated mode)')
  .option('--schema', 'Flag: Schema change detected (Automated mode)')
  .option('--breaking', 'Flag: Breaking change detected (Automated mode)')
  .option('--flagged', 'Flag: Feature flagged (Automated mode)')
  .option('--rollback', 'Flag: Rollback script exists (Automated mode)')
  .option('--monitoring', 'Flag: Monitoring configured (Automated mode)')
  .option('--owner <name>', 'Rollback owner (Automated mode)')
  .action(async (description, options) => {
    // Import PHASE mode implementations dynamically
    const { mvrPersonal, mvrHuddle, mvrAutomated, mvrSupported, mvrEnterprise } = await import('./modes/mvr-phase.js');

    // Determine mode (from option or config)
    const mode = options.mode || getConfig('phase') || 'personal';

    // Quick shortcut
    if (options.quick) {
      await quickMvrCommand(description);
      return;
    }

    // Route to appropriate PHASE mode
    switch (mode) {
      case 'personal':
        await mvrPersonal(description);
        break;
      case 'huddle':
        await mvrHuddle();
        break;
      case 'automated':
        await mvrAutomated(description, options);
        break;
      case 'supported':
        await mvrSupported(description);
        break;
      case 'enterprise':
        await mvrEnterprise(description);
        break;
      default:
        // Default to standard MVR
        await mvrCommand(description, options);
    }
  });

// Quick alias for MVR
program
  .command('quick')
  .description('⚡ Quick RAMP check (3-second screen)')
  .argument('[description]', 'Decision description')
  .action(quickMvrCommand);

// Huddle mode alias
program
  .command('huddle')
  .description('👥 Huddle MVR: Team RAMP Round (3 min/item)')
  .action(async () => {
    const { mvrHuddle } = await import('./modes/mvr-phase.js');
    await mvrHuddle();
  });

// Automated mode alias (for CI/CD)
program
  .command('gate')
  .description('🤖 Automated MVR: RAMP Gate for CI/CD pipelines')
  .argument('[description]', 'Decision/change description')
  .option('--json', 'JSON output')
  .option('--oneline', 'One-line output for shell parsing')
  .option('--strict', 'Exit code 1 on BLOCK')
  .option('--schema', 'Flag: Schema change detected')
  .option('--breaking', 'Flag: Breaking change detected')
  .option('--flagged', 'Flag: Feature flagged')
  .option('--rollback', 'Flag: Rollback script exists')
  .option('--monitoring', 'Flag: Monitoring configured')
  .option('--owner <name>', 'Rollback owner')
  .action(async (description, options) => {
    const { mvrAutomated } = await import('./modes/mvr-phase.js');
    await mvrAutomated(description, options);
  });

// Full RAMPKIT (placeholder - can expand)
program
  .command('start')
  .description('🔵 Start full RAMPKIT assessment (7 steps)')
  .argument('[description]', 'Decision description')
  .action(async (description) => {
    console.log(chalk.yellow('\n🚧 Full RAMPKIT coming soon. For now, use MVR:\n'));
    await mvrCommand(description, {});
  });

// Methodology reference commands
program
  .command('levels')
  .description('📊 Show RAMP levels reference (L1-L5)')
  .action(showLevels);

program
  .command('protocol')
  .description('📜 Show RAMPKIT 7-step protocol')
  .action(showProtocol);

program
  .command('doors')
  .description('🚪 Show DOORS principles')
  .action(showDoors);

program
  .command('phase')
  .description('🎭 Show PHASE modes')
  .action(showPhase);

program
  .command('climbs')
  .description('🧗 Show CLIMBS patterns')
  .action(showClimbs);

program
  .command('ref')
  .description('📋 Quick reference card')
  .action(showRef);

// History & Status
program
  .command('history')
  .description('📜 View decision history')
  .option('-n, --count <count>', 'Number of decisions to show', '10')
  .action(showHistory);

program
  .command('status')
  .description('📊 Show current status')
  .action(showStatus);

// Config
program
  .command('config')
  .description('⚙️  Configuration')
  .option('-p, --phase <mode>', 'Set PHASE mode')
  .action(configCommand);

// Parse and run
program.parse();

// Show help if no command
if (!process.argv.slice(2).length) {
  printBanner();
  program.outputHelp();
}
