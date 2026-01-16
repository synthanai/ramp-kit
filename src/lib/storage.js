/**
 * RAMP-KIT: Storage Layer
 * Persist RAMP decisions locally
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

// Storage directory
const RAMP_DIR = path.join(os.homedir(), '.ramp-kit');
const DECISIONS_FILE = path.join(RAMP_DIR, 'decisions.json');
const CONFIG_FILE = path.join(RAMP_DIR, 'config.json');

/**
 * Ensure storage directory exists
 */
function ensureStorage() {
    if (!fs.existsSync(RAMP_DIR)) {
        fs.mkdirSync(RAMP_DIR, { recursive: true });
    }
}

/**
 * Load all decisions
 */
export function loadDecisions() {
    ensureStorage();
    if (!fs.existsSync(DECISIONS_FILE)) {
        return [];
    }
    try {
        const data = fs.readFileSync(DECISIONS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

/**
 * Save a decision
 */
export function saveDecision(decision) {
    ensureStorage();
    const decisions = loadDecisions();

    const record = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        ...decision
    };

    decisions.push(record);
    fs.writeFileSync(DECISIONS_FILE, JSON.stringify(decisions, null, 2));
    return record;
}

/**
 * Get decisions by level
 */
export function getDecisionsByLevel(level) {
    const decisions = loadDecisions();
    return decisions.filter(d => d.level === level);
}

/**
 * Get recent decisions
 */
export function getRecentDecisions(count = 10) {
    const decisions = loadDecisions();
    return decisions.slice(-count).reverse();
}

/**
 * Get decisions by domain
 */
export function getDecisionsByDomain(domain) {
    const decisions = loadDecisions();
    return decisions.filter(d => d.domain === domain);
}

/**
 * Search decisions
 */
export function searchDecisions(query) {
    const decisions = loadDecisions();
    const lower = query.toLowerCase();
    return decisions.filter(d =>
        d.description?.toLowerCase().includes(lower) ||
        d.domain?.toLowerCase().includes(lower) ||
        d.level?.toLowerCase().includes(lower)
    );
}

/**
 * Get decision statistics
 */
export function getStats() {
    const decisions = loadDecisions();

    const stats = {
        total: decisions.length,
        byLevel: { L1: 0, L2: 0, L3: 0, L4: 0, L5: 0 },
        byDirection: { 'RAMP DOWN': 0, 'RAMP UP': 0 },
        byDomain: {},
        avgScore: 0,
        last30Days: 0
    };

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let totalScore = 0;

    decisions.forEach(d => {
        // By level
        if (d.level && stats.byLevel[d.level] !== undefined) {
            stats.byLevel[d.level]++;
        }

        // By direction
        if (d.direction?.includes('DOWN')) {
            stats.byDirection['RAMP DOWN']++;
        } else if (d.direction?.includes('UP')) {
            stats.byDirection['RAMP UP']++;
        }

        // By domain
        if (d.domain) {
            stats.byDomain[d.domain] = (stats.byDomain[d.domain] || 0) + 1;
        }

        // Score
        if (d.score) {
            totalScore += d.score;
        }

        // Last 30 days
        if (new Date(d.timestamp) > thirtyDaysAgo) {
            stats.last30Days++;
        }
    });

    stats.avgScore = decisions.length > 0 ? Math.round(totalScore / decisions.length) : 0;

    return stats;
}

/**
 * Export decisions to markdown
 */
export function exportToMarkdown() {
    const decisions = loadDecisions();
    let md = `# RAMP Decision History\n\n`;
    md += `*Exported: ${new Date().toISOString()}*\n\n`;
    md += `| Date | Decision | Score | Level | Direction |\n`;
    md += `|------|----------|-------|-------|----------|\n`;

    decisions.forEach(d => {
        const date = new Date(d.timestamp).toLocaleDateString();
        md += `| ${date} | ${d.description} | ${d.score}/100 | ${d.level} | ${d.direction} |\n`;
    });

    return md;
}

/**
 * Load config
 */
export function loadConfig() {
    ensureStorage();
    if (!fs.existsSync(CONFIG_FILE)) {
        return { defaultDomain: 'technology', owner: process.env.USER || 'unknown' };
    }
    try {
        return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    } catch (e) {
        return { defaultDomain: 'technology', owner: process.env.USER || 'unknown' };
    }
}

/**
 * Save config
 */
export function saveConfig(config) {
    ensureStorage();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

/**
 * Generate unique ID
 */
function generateId() {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const rand = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `RAMP-${date}-${rand}`;
}

/**
 * Clear all decisions (use with caution)
 */
export function clearDecisions() {
    ensureStorage();
    fs.writeFileSync(DECISIONS_FILE, '[]');
}
