/**
 * RAMP-KIT: List Command
 * List available RAMP card templates
 */

import chalk from 'chalk';
import Table from 'cli-table3';
import { DOMAINS, CARD_TEMPLATES, getCardsByDomain, getCardsByLevel } from '../lib/cards.js';

export async function listCommand(options) {
    console.log(chalk.cyan.bold('\n📚 RAMP Card Library\n'));

    let cards = CARD_TEMPLATES;

    // Filter by domain
    if (options.domain) {
        cards = getCardsByDomain(options.domain);
        const domain = DOMAINS[options.domain];
        if (domain) {
            console.log(chalk.bold(`${domain.emoji} ${domain.name} Domain\n`));
        }
    }

    // Filter by level
    if (options.level) {
        cards = getCardsByLevel(options.level);
        console.log(chalk.bold(`Level: ${options.level}\n`));
    }

    // Show domains if no filter
    if (!options.domain && !options.level) {
        console.log(chalk.bold('Available Domains:\n'));

        const domainTable = new Table({
            head: [
                chalk.cyan('Domain'),
                chalk.cyan('Cards'),
                chalk.cyan('Range')
            ],
            style: { head: [], border: [] }
        });

        for (const [key, domain] of Object.entries(DOMAINS)) {
            domainTable.push([
                `${domain.emoji} ${domain.name}`,
                `${domain.range[1] - domain.range[0] + 1}`,
                `${domain.range[0].toString().padStart(3, '0')}-${domain.range[1].toString().padStart(3, '0')}`
            ]);
        }

        console.log(domainTable.toString());
        console.log(chalk.dim(`\nTotal: 108 cards across 18 domains`));
        console.log(chalk.dim(`\nUse ${chalk.cyan('ramp-kit list -d <domain>')} to filter by domain`));
        console.log(chalk.dim(`Use ${chalk.cyan('ramp-kit list -l <level>')} to filter by level\n`));
        return;
    }

    // Show filtered cards
    if (cards.length === 0) {
        console.log(chalk.yellow('No cards found matching the filter.\n'));
        return;
    }

    const table = new Table({
        head: [
            chalk.cyan('ID'),
            chalk.cyan('Name'),
            chalk.cyan('Domain'),
            chalk.cyan('Level')
        ],
        style: { head: [], border: [] }
    });

    for (const card of cards) {
        const domain = DOMAINS[card.domain];
        const levelColor = card.level.includes('1') || card.level.includes('2') ? chalk.green :
            card.level.includes('3') ? chalk.yellow : chalk.red;

        table.push([
            card.id,
            card.name,
            domain ? `${domain.emoji} ${domain.name}` : card.domain,
            levelColor(card.level)
        ]);
    }

    console.log(table.toString());
    console.log(chalk.dim(`\n${cards.length} cards found\n`));
}
