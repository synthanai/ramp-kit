/**
 * RAMP-KIT: Assess Command
 * Full RAMP assessment
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import boxen from 'boxen';
import { DOMAINS } from '../lib/cards.js';
import { scoreCommand } from './score.js';

export async function assessCommand(options) {
    console.log(chalk.cyan.bold('\n🔍 RAMP-KIT: Full Assessment\n'));

    // If domain specified, show domain-specific info
    if (options.domain) {
        const domain = DOMAINS[options.domain];
        if (domain) {
            console.log(chalk.bold(`${domain.emoji} ${domain.name} Domain`));
            console.log(chalk.dim(`Cards ${domain.range[0].toString().padStart(3, '0')}-${domain.range[1].toString().padStart(3, '0')}\n`));
        }
    }

    // Run full assessment
    const { description } = await inquirer.prompt([
        {
            type: 'input',
            name: 'description',
            message: 'Describe the decision to assess:',
            validate: (input) => input.length > 0 || 'Please provide a description'
        }
    ]);

    // Run score assessment
    await scoreCommand(description, { quick: false });
}
