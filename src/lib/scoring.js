/**
 * RAMP Scoring Engine
 * Calculates RAMP Score (0-100) and Level (L1-L5)
 */

import chalk from 'chalk';

// Standard assessment questions
export const ASSESSMENT_QUESTIONS = [
    {
        id: 'undo_24h',
        question: 'Can this be undone within 24 hours?',
        options: [
            { label: 'Yes, easily', points: 25 },
            { label: 'Yes, with effort', points: 15 },
            { label: 'Partially', points: 10 },
            { label: 'No', points: 0 }
        ]
    },
    {
        id: 'additive',
        question: 'Is this change additive (not replacing/removing)?',
        options: [
            { label: 'Yes, purely additive', points: 20 },
            { label: 'Mostly additive', points: 15 },
            { label: 'Replaces with parallel run', points: 10 },
            { label: 'Removes/replaces completely', points: 0 }
        ]
    },
    {
        id: 'blast_radius',
        question: 'What is the blast radius if this fails?',
        options: [
            { label: 'Limited (<10% users/systems)', points: 20 },
            { label: 'Contained (10-50%)', points: 15 },
            { label: 'Significant (50-90%)', points: 10 },
            { label: 'Total (all users/systems)', points: 0 }
        ]
    },
    {
        id: 'rollback_tested',
        question: 'Has the rollback mechanism been tested?',
        options: [
            { label: 'Yes, in production-like environment', points: 20 },
            { label: 'Yes, in staging', points: 15 },
            { label: 'Documented but not tested', points: 10 },
            { label: 'No rollback plan', points: 0 }
        ]
    },
    {
        id: 'detection_time',
        question: 'How quickly can we detect if this goes wrong?',
        options: [
            { label: 'Immediately (automated alerts)', points: 15 },
            { label: 'Within minutes (monitoring)', points: 12 },
            { label: 'Within hours (manual checks)', points: 8 },
            { label: 'Days or unknown', points: 0 }
        ]
    }
];

// Quick assessment (3 questions)
export const QUICK_QUESTIONS = [
    {
        id: 'reversible',
        question: 'Can we undo this if it goes wrong?',
        options: [
            { label: 'Yes, instantly', points: 40 },
            { label: 'Yes, with effort', points: 30 },
            { label: 'Partially', points: 15 },
            { label: 'No', points: 0 }
        ]
    },
    {
        id: 'impact',
        question: 'What\'s the worst-case impact?',
        options: [
            { label: 'Minor inconvenience', points: 35 },
            { label: 'Significant but recoverable', points: 25 },
            { label: 'Major disruption', points: 10 },
            { label: 'Catastrophic/irreversible harm', points: 0 }
        ]
    },
    {
        id: 'confidence',
        question: 'How confident are we in the plan?',
        options: [
            { label: 'Have done this many times', points: 25 },
            { label: 'Have done similar things', points: 18 },
            { label: 'First time but researched', points: 10 },
            { label: 'Uncertain/novel territory', points: 0 }
        ]
    }
];

/**
 * Calculate RAMP Level from score
 */
export function scoreToLevel(score) {
    if (score >= 90) return { level: 'L1', name: 'Instant', time: '<1h', color: 'green' };
    if (score >= 70) return { level: 'L2', name: 'Rapid', time: '<1d', color: 'green' };
    if (score >= 50) return { level: 'L3', name: 'Planned', time: '<1w', color: 'yellow' };
    if (score >= 30) return { level: 'L4', name: 'Effortful', time: '<1mo', color: 'red' };
    return { level: 'L5', name: 'Irreversible', time: 'N/A', color: 'magenta' };
}

/**
 * Get RAMP direction recommendation
 */
export function getDirection(score) {
    if (score >= 70) {
        return {
            direction: 'RAMP DOWN',
            symbol: '▼',
            color: 'green',
            action: 'Proceed with monitoring'
        };
    } else if (score >= 50) {
        return {
            direction: 'RAMP UP',
            symbol: '▲',
            color: 'yellow',
            action: 'Add checkpoints and approval'
        };
    } else {
        return {
            direction: 'RAMP UP ⚠️',
            symbol: '▲▲',
            color: 'red',
            action: 'Full process required'
        };
    }
}

/**
 * Format score display
 */
export function formatScore(score) {
    const level = scoreToLevel(score);
    const direction = getDirection(score);

    const colorFn = chalk[level.color] || chalk.white;
    const dirColorFn = chalk[direction.color] || chalk.white;

    return {
        score,
        display: `${colorFn.bold(score + '/100')} → ${colorFn.bold(level.level)} (${level.name})`,
        level: level.level,
        levelName: level.name,
        direction: direction.direction,
        directionDisplay: dirColorFn.bold(`${direction.direction} ${direction.symbol}`),
        action: direction.action
    };
}

/**
 * Calculate score from answers
 */
export function calculateScore(answers) {
    return Object.values(answers).reduce((sum, points) => sum + points, 0);
}

/**
 * Get time investment recommendation
 */
export function getTimeInvestment(level) {
    const times = {
        'L1': { setup: '5 minutes', checkpoints: 'None' },
        'L2': { setup: '15 minutes', checkpoints: '3 checkpoints' },
        'L3': { setup: '45 minutes', checkpoints: '5 checkpoints' },
        'L4': { setup: '2 hours + approval', checkpoints: 'Daily reviews' },
        'L5': { setup: 'Half-day + committee', checkpoints: 'Continuous' }
    };
    return times[level] || times['L3'];
}
