/**
 * RAMP-KIT: History Command
 * View past RAMP decisions
 */

import chalk from 'chalk';
import Table from 'cli-table3';
import boxen from 'boxen';
import inquirer from 'inquirer';
import {
    loadDecisions,
    getRecentDecisions,
    getStats,
    searchDecisions,
    exportToMarkdown
} from '../lib/storage.js';
import fs from 'fs';

export async function historyCommand(options) {
    console.log(chalk.cyan.bold('\n📜 RAMP-KIT: Decision History\n'));

    const decisions = loadDecisions();

    if (decisions.length === 0) {
        console.log(boxen(
            `${chalk.yellow('No decisions recorded yet.')}\n\n` +
            `Run ${chalk.cyan('ramp-kit score')} to assess a decision,\n` +
            `then select ${chalk.cyan('Save')} to record it.`,
            {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'yellow'
            }
        ));
        return;
    }

    // Show stats first
    const stats = getStats();

    console.log(boxen(
        `${chalk.bold('Total Decisions:')} ${stats.total}\n` +
        `${chalk.bold('Last 30 Days:')} ${stats.last30Days}\n` +
        `${chalk.bold('Average Score:')} ${stats.avgScore}/100\n\n` +
        `${chalk.bold('By Level:')}\n` +
        `  ${chalk.green('L1')}: ${stats.byLevel.L1}  ` +
        `${chalk.green('L2')}: ${stats.byLevel.L2}  ` +
        `${chalk.yellow('L3')}: ${stats.byLevel.L3}  ` +
        `${chalk.red('L4')}: ${stats.byLevel.L4}  ` +
        `${chalk.magenta('L5')}: ${stats.byLevel.L5}\n\n` +
        `${chalk.bold('Direction:')}\n` +
        `  ${chalk.green('RAMP DOWN ▼')}: ${stats.byDirection['RAMP DOWN']}  ` +
        `${chalk.red('RAMP UP ▲')}: ${stats.byDirection['RAMP UP']}`,
        {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'cyan',
            title: '📊 Statistics',
            titleAlignment: 'center'
        }
    ));

    // Show recent decisions
    const count = options.count || 10;
    const recent = getRecentDecisions(count);

    if (recent.length > 0) {
        const table = new Table({
            head: [
                chalk.cyan('ID'),
                chalk.cyan('Date'),
                chalk.cyan('Decision'),
                chalk.cyan('Score'),
                chalk.cyan('Level'),
                chalk.cyan('Direction')
            ],
            style: { head: [], border: [] },
            colWidths: [18, 12, 30, 8, 6, 12]
        });

        recent.forEach(d => {
            const date = new Date(d.timestamp).toLocaleDateString();
            const desc = d.description?.substring(0, 27) + (d.description?.length > 27 ? '...' : '');
            const levelColor = d.level?.includes('1') || d.level?.includes('2') ? chalk.green :
                d.level?.includes('3') ? chalk.yellow : chalk.red;
            const dirColor = d.direction?.includes('DOWN') ? chalk.green : chalk.red;

            table.push([
                chalk.dim(d.id),
                date,
                desc,
                `${d.score}/100`,
                levelColor(d.level),
                dirColor(d.direction?.replace(' ▼', '').replace(' ▲', ''))
            ]);
        });

        console.log(chalk.bold(`\nRecent Decisions (${recent.length}):\n`));
        console.log(table.toString());
    }

    // Actions menu
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                { name: '🔍 Search decisions', value: 'search' },
                { name: '📊 View by level', value: 'level' },
                { name: '📁 Export to markdown', value: 'export' },
                { name: '✅ Done', value: 'done' }
            ]
        }
    ]);

    if (action === 'search') {
        const { query } = await inquirer.prompt([
            {
                type: 'input',
                name: 'query',
                message: 'Search term:'
            }
        ]);

        const results = searchDecisions(query);
        console.log(chalk.bold(`\nFound ${results.length} decision(s):\n`));
        results.forEach(d => {
            console.log(`  ${chalk.dim(d.id)} - ${d.description} (${d.level})`);
        });

    } else if (action === 'level') {
        const { level } = await inquirer.prompt([
            {
                type: 'list',
                name: 'level',
                message: 'Select level:',
                choices: ['L1', 'L2', 'L3', 'L4', 'L5']
            }
        ]);

        const filtered = decisions.filter(d => d.level === level);
        console.log(chalk.bold(`\n${level} Decisions (${filtered.length}):\n`));
        filtered.forEach(d => {
            console.log(`  ${chalk.dim(d.id)} - ${d.description}`);
        });

    } else if (action === 'export') {
        const md = exportToMarkdown();
        const filename = `ramp-history-${new Date().toISOString().split('T')[0]}.md`;
        fs.writeFileSync(filename, md);
        console.log(chalk.green(`\n✅ Exported to ${filename}\n`));
    }
}
