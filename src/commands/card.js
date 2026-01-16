/**
 * RAMP-KIT: Card Command
 * Generate a RAMP card
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import boxen from 'boxen';
import fs from 'fs';
import { generateCard, DOMAINS } from '../lib/cards.js';
import { formatScore } from '../lib/scoring.js';

export async function cardCommand(description, options) {
    console.log(chalk.cyan.bold('\n📝 RAMP-KIT: Generate Card\n'));

    let cardData = {
        description: description,
        score: options.score || null,
        level: options.level || null,
        direction: null,
        owner: null,
        domain: null
    };

    // Gather missing info
    const prompts = [];

    if (!cardData.description) {
        prompts.push({
            type: 'input',
            name: 'description',
            message: 'Decision description:',
            validate: (input) => input.length > 0 || 'Please provide a description'
        });
    }

    if (!cardData.score) {
        prompts.push({
            type: 'number',
            name: 'score',
            message: 'RAMP Score (0-100):',
            default: 50,
            validate: (input) => (input >= 0 && input <= 100) || 'Score must be 0-100'
        });
    }

    if (!cardData.level) {
        prompts.push({
            type: 'list',
            name: 'level',
            message: 'RAMP Level:',
            choices: [
                { name: 'L1 - Instant (<1h)', value: 'L1' },
                { name: 'L2 - Rapid (<1d)', value: 'L2' },
                { name: 'L3 - Planned (<1w)', value: 'L3' },
                { name: 'L4 - Effortful (<1mo)', value: 'L4' },
                { name: 'L5 - Irreversible', value: 'L5' }
            ]
        });
    }

    prompts.push({
        type: 'list',
        name: 'direction',
        message: 'RAMP Direction:',
        choices: [
            { name: '▼ RAMP DOWN (proceed with monitoring)', value: 'RAMP DOWN ▼' },
            { name: '▲ RAMP UP (add rigor)', value: 'RAMP UP ▲' }
        ]
    });

    prompts.push({
        type: 'list',
        name: 'domain',
        message: 'Domain:',
        choices: Object.entries(DOMAINS).map(([key, val]) => ({
            name: `${val.emoji} ${val.name}`,
            value: val.name
        }))
    });

    prompts.push({
        type: 'input',
        name: 'owner',
        message: 'Decision owner:',
        default: process.env.USER || 'Unknown'
    });

    // Get answers
    const answers = await inquirer.prompt(prompts);
    cardData = { ...cardData, ...answers };

    // Generate card
    const card = generateCard(cardData);

    // Display preview
    console.log(chalk.dim('\n--- Card Preview ---\n'));
    console.log(chalk.white(card.substring(0, 500) + '...\n'));

    // Ask about saving
    const { saveOption } = await inquirer.prompt([
        {
            type: 'list',
            name: 'saveOption',
            message: 'What would you like to do?',
            choices: [
                { name: '💾 Save to file', value: 'save' },
                { name: '📋 Copy to clipboard (display full)', value: 'display' },
                { name: '❌ Cancel', value: 'cancel' }
            ]
        }
    ]);

    if (saveOption === 'save') {
        const defaultFilename = `RAMP-CARD-${new Date().toISOString().split('T')[0]}-${cardData.description.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}.md`;

        const { filename } = await inquirer.prompt([
            {
                type: 'input',
                name: 'filename',
                message: 'Filename:',
                default: options.output || defaultFilename
            }
        ]);

        fs.writeFileSync(filename, card);
        console.log(boxen(
            `${chalk.green('✅ Card saved successfully!')}\n\n` +
            `${chalk.bold('File:')} ${filename}`,
            {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'green'
            }
        ));
    } else if (saveOption === 'display') {
        console.log('\n' + card);
    }
}
