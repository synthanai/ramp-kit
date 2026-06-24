/**
 * RAMP-KIT Utilities
 * Shared functions and constants
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

// ============================================
// CONFIGURATION
// ============================================

export const VERSION = '2.0.0';
export const RAMP_DIR = join(homedir(), '.ramp');
export const CONFIG_PATH = join(RAMP_DIR, 'config.json');
export const DECISIONS_DIR = join(RAMP_DIR, 'decisions');

export function ensureDirectories() {
    [RAMP_DIR, DECISIONS_DIR].forEach(dir => {
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    });
}

// ============================================
// CONFIG MANAGEMENT
// ============================================

export function loadConfig() {
    ensureDirectories();
    if (existsSync(CONFIG_PATH)) {
        try { return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8')); }
        catch { return { phase: 'personal' }; }
    }
    return { phase: 'personal' };
}

export function saveConfig(config) {
    ensureDirectories();
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export function getConfig(key) { return loadConfig()[key]; }
export function setConfig(key, value) { const c = loadConfig(); c[key] = value; saveConfig(c); }

// ============================================
// DECISION STORAGE
// ============================================

export function generateId() {
    return `ramp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

export function saveDecision(decision) {
    ensureDirectories();
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const slug = decision.decision?.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'decision';
    const fn = `${ts}_${slug}.json`;
    writeFileSync(join(DECISIONS_DIR, fn), JSON.stringify(decision, null, 2));
    return fn;
}

export function listDecisions(limit = 10) {
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

// ============================================
// METHODOLOGY DEFINITIONS
// ============================================

export const RAMP_LEVELS = {
    L1: { name: 'Instant', time: '<1 hour', action: 'Ship it', color: 'green', emoji: '⚡' },
    L2: { name: 'Rapid', time: '<1 day', action: 'Monitor & Ship', color: 'green', emoji: '🔄' },
    L3: { name: 'Planned', time: '<1 week', action: 'Plan rollback first', color: 'yellow', emoji: '📋' },
    L4: { name: 'Effortful', time: '<1 month', action: 'Require approval', color: 'red', emoji: '⚠️' },
    L5: { name: 'Irreversible', time: 'Permanent', action: 'Full RAMP UP', color: 'magenta', emoji: '🚫' }
};

export const RAMPKIT_PROTOCOL = {
    R: { letter: 'R', name: 'RECOGNIZE', question: 'What are we doing?', output: 'Decision statement' },
    A: { letter: 'A', name: 'ASSESS', question: 'How reversible is it?', output: 'RAMP Score (0-100)' },
    M: { letter: 'M', name: 'MAP', question: 'What\'s the containment plan?', output: 'Rollback plan & signals' },
    P: { letter: 'P', name: 'POSITION', question: 'RAMP UP or RAMP DOWN?', output: 'Direction decision' },
    K: { letter: 'K', name: 'KICKOFF', question: 'Who owns this?', output: 'RAMP Card' },
    I: { letter: 'I', name: 'INSPECT', question: 'Are signals nominal?', output: 'Checkpoint reviews' },
    T: { letter: 'T', name: 'TRACK', question: 'What did we learn?', output: 'Decision record' }
};

export const DOORS_PRINCIPLES = {
    D: { letter: 'D', name: 'DECLARE', check: 'Is the reversibility classification explicit?' },
    O1: { letter: 'O', name: 'OBSERVE', check: 'Are signals in place to detect problems?' },
    O2: { letter: 'O', name: 'OWN', check: 'Is there a named rollback owner?' },
    R: { letter: 'R', name: 'READY', check: 'Is the rollback mechanism tested?' },
    S: { letter: 'S', name: 'SIGNAL', check: 'Do we have quantitative tripwires?' }
};

export const PHASE_MODES = {
    personal: { name: 'Personal', who: 'Individual', speed: 'Fastest', time: '5 min', icon: '👤', description: 'RAMP Tap' },
    huddle: { name: 'Huddle', who: 'Team', speed: 'Fast', time: '3 min/item', icon: '👥', description: 'RAMP Round' },
    automated: { name: 'Automated', who: 'Pipeline', speed: 'Instant', time: '<30 sec', icon: '🤖', description: 'RAMP Gate' },
    supported: { name: 'Supported', who: 'Human + AI', speed: 'Medium', time: '10-15 min', icon: '🤝', description: 'RAMP Copilot' },
    enterprise: { name: 'Enterprise', who: 'Governance', speed: 'Slowest', time: '30-45 min', icon: '🏛️', description: 'RAMP Brief' }
};

export const CLIMBS_PATTERNS = {
    C: { letter: 'C', name: 'Checkpoint Cascade', use: 'Progressive rollout with gates' },
    L: { letter: 'L', name: 'Lock-in Detection', use: 'Identify points of no return' },
    I: { letter: 'I', name: 'Inverse RAMP', use: 'When NOT shipping is the risk' },
    M: { letter: 'M', name: 'Momentum Brake', use: 'Confidence check when scope creeps' },
    B: { letter: 'B', name: 'Blast Radius Mapping', use: 'Quantify affected systems/users' },
    S: { letter: 'S', name: 'Staged Commitment', use: 'Incremental investment gates' }
};

export const ASSESSMENT_QUESTIONS = [
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

export function scoreToLevel(score) {
    if (score >= 90) return 'L1';
    if (score >= 70) return 'L2';
    if (score >= 50) return 'L3';
    if (score >= 30) return 'L4';
    return 'L5';
}

export function levelToSignal(level) {
    if (level === 'L1' || level === 'L2') {
        return { signal: '🟢 GREEN', action: 'RAMP DOWN', message: 'Ship it now' };
    }
    if (level === 'L3') {
        return { signal: '🟡 YELLOW', action: 'RAMP CAREFULLY', message: 'Ship with monitoring' };
    }
    return { signal: '🔴 RED', action: 'RAMP UP', message: 'Stop and escalate' };
}
