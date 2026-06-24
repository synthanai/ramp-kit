/**
 * RAMP-KIT: Score Command
 * Quick RAMP score assessment
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import {
    ASSESSMENT_QUESTIONS,
    QUICK_QUESTIONS,
    formatScore,
    calculateScore,
    getTimeInvestment
} from '../lib/scoring.js';
import { saveDecision } from '../lib/storage.js';

export async function scoreCommand(description, options) {
    console.log(chalk.cyan.bold('\n📊 RAMP-KIT: Score Assessment\n'));
    console.log(chalk.dim('ASSESS step: "How reversible is it?"\n'));

    // Get description if not provided
    let decisionDescription = description;
    let domain = options.domain || 'general';

    if (!description) {
        const { desc } = await inquirer.prompt([
            {
                type: 'input',
                name: 'desc',
                message: 'What decision are you assessing?',
                validate: (input) => input.length > 0 || 'Please provide a description'
            }
        ]);
        decisionDescription = desc;
    }

    console.log(chalk.dim(`\nAssessing: "${decisionDescription}"\n`));

    // Choose quick or full assessment
    const questions = options.quick ? QUICK_QUESTIONS : ASSESSMENT_QUESTIONS;
    const answers = {};

    // Ask each question
    for (const q of questions) {
        const { answer } = await inquirer.prompt([
            {
                type: 'list',
                name: 'answer',
                message: q.question,
                choices: q.options.map(opt => ({
                    name: `${opt.label} ${chalk.dim(`(+${opt.points})`)}`,
                    value: opt.points
                }))
            }
        ]);
        answers[q.id] = answer;
    }

    // Calculate score
    const spinner = ora('Calculating RAMP score...').start();
    await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause for effect
    spinner.stop();

    const score = calculateScore(answers);
    const result = formatScore(score);
    const timeInvest = getTimeInvestment(result.level);

    // Display result
    console.log('\n');
    console.log(boxen(
        `${chalk.bold.white('Decision:')} ${decisionDescription}\n\n` +
        `${chalk.bold('RAMP Score:')} ${result.display}\n` +
        `${chalk.bold('Direction:')} ${result.directionDisplay}\n\n` +
        `${chalk.bold('Recommended Action:')}\n${result.action}\n\n` +
        `${chalk.bold('Time Investment:')}\n` +
        `  Setup: ${timeInvest.setup}\n` +
        `  Checkpoints: ${timeInvest.checkpoints}`,
        {
            padding: 1,
            margin: 1,
            borderStyle: 'double',
            borderColor: result.level === 'L1' || result.level === 'L2' ? 'green' :
                result.level === 'L3' ? 'yellow' : 'red',
            title: `📊 RAMP Score: ${score}/100`,
            titleAlignment: 'center'
        }
    ));

    // Show DOORS reminder for L3+
    if (score < 70) {
        console.log(boxen(
            `${chalk.bold.yellow('💡 DOORS Check Recommended')}\n\n` +
            `${chalk.yellow('D')}eclare: What type of door is this?\n` +
            `${chalk.yellow('O')}bserve: What would close this door?\n` +
            `${chalk.yellow('O')}wn: Who can pull us back?\n` +
            `${chalk.yellow('R')}eady: Can we undo this tomorrow?\n` +
            `${chalk.yellow('S')}ignal: How will we know to reverse?\n\n` +
            `${chalk.dim('Run:')} ${chalk.cyan('ramp-kit doors')} ${chalk.dim('for full DOORS check')}`,
            {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'yellow',
                title: '⚠️ RAMP UP Required',
                titleAlignment: 'center'
            }
        ));
    }

    // Ask about next steps
    const { nextStep } = await inquirer.prompt([
        {
            type: 'list',
            name: 'nextStep',
            message: 'What would you like to do next?',
            choices: [
                { name: '💾 Save this decision', value: 'save' },
                { name: '📝 Generate RAMP Card', value: 'card' },
                { name: '🚪 Run DOORS Check', value: 'doors' },
                { name: '✅ Done for now', value: 'done' }
            ]
        }
    ]);

    if (nextStep === 'save') {
        const record = saveDecision({
            description: decisionDescription,
            score: score,
            level: result.level,
            direction: result.direction,
            domain: domain
        });
        console.log(chalk.green(`\n✅ Decision saved! ID: ${record.id}\n`));
        console.log(chalk.dim(`View history: ${chalk.cyan('ramp-kit history')}\n`));
    } else if (nextStep === 'card') {
        const { cardCommand } = await import('./card.js');
        await cardCommand(decisionDescription, {
            level: result.level,
            score: score
        });
    } else if (nextStep === 'doors') {
        const { doorsCommand } = await import('./doors.js');
        await doorsCommand(decisionDescription);
    }

    return { score, level: result.level, direction: result.direction };
}

