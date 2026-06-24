/**
 * RAMP-KIT: Start Command
 * Begin a new RAMP assessment (RECOGNIZE step)
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import boxen from 'boxen';

export async function startCommand(description, options) {
    console.log(chalk.cyan.bold('\n🚀 RAMP-KIT: Start Assessment\n'));
    console.log(chalk.dim('RECOGNIZE step: "What are we doing?"\n'));

    let decisionDescription = description;

    // Interactive mode or no description provided
    if (options.interactive || !description) {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'description',
                message: 'Describe the decision/action:',
                default: description,
                validate: (input) => input.length > 0 || 'Please provide a description'
            },
            {
                type: 'list',
                name: 'domain',
                message: 'What domain is this decision in?',
                choices: [
                    { name: '💻 Technology', value: 'technology' },
                    { name: '📦 Product', value: 'product' },
                    { name: '👥 People', value: 'people' },
                    { name: '💰 Finance', value: 'finance' },
                    { name: '⚖️ Legal/Compliance', value: 'legal' },
                    { name: '🤝 Partnership', value: 'partnership' },
                    { name: '📢 Communication', value: 'communication' },
                    { name: '🔐 Security', value: 'security' },
                    { name: '🤖 AI/ML', value: 'ai' },
                    { name: '⚙️ Operations', value: 'operations' },
                    { name: '🏥 Healthcare', value: 'healthcare' },
                    { name: '📣 Marketing', value: 'marketing' },
                    { name: '🧑 Personal', value: 'personal' },
                    { name: '❓ Other', value: 'other' }
                ]
            },
            {
                type: 'input',
                name: 'owner',
                message: 'Who owns this decision?',
                default: process.env.USER || 'Unknown'
            },
            {
                type: 'list',
                name: 'urgency',
                message: 'How urgent is this decision?',
                choices: [
                    { name: '🔥 Immediate (today)', value: 'immediate' },
                    { name: '⏰ Soon (this week)', value: 'soon' },
                    { name: '📅 Planned (this month)', value: 'planned' },
                    { name: '🗓️  Future (no rush)', value: 'future' }
                ]
            }
        ]);

        decisionDescription = answers.description;

        // Display summary
        console.log('\n');
        console.log(boxen(
            `${chalk.bold.cyan('RAMP Assessment Initiated')}\n\n` +
            `${chalk.bold('Decision:')} ${answers.description}\n` +
            `${chalk.bold('Domain:')} ${answers.domain}\n` +
            `${chalk.bold('Owner:')} ${answers.owner}\n` +
            `${chalk.bold('Urgency:')} ${answers.urgency}\n\n` +
            `${chalk.dim('Next step: Run')} ${chalk.cyan('ramp-kit assess')} ${chalk.dim('or')} ${chalk.cyan('ramp-kit score')}`,
            {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'cyan',
                title: '✅ RECOGNIZE Complete',
                titleAlignment: 'center'
            }
        ));

        // Ask to continue to assessment
        const { continueToAssess } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'continueToAssess',
                message: 'Continue to ASSESS step?',
                default: true
            }
        ]);

        if (continueToAssess) {
            // Import and run score command
            const { scoreCommand } = await import('./score.js');
            await scoreCommand(decisionDescription, { quick: false });
        }

    } else {
        // Non-interactive: just acknowledge
        console.log(boxen(
            `${chalk.bold('Decision:')} ${decisionDescription}\n\n` +
            `${chalk.dim('Next: Run')} ${chalk.cyan('ramp-kit assess')} ${chalk.dim('to score this decision')}`,
            {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'cyan',
                title: '✅ Recognized',
                titleAlignment: 'center'
            }
        ));
    }
}
