/**
 * RAMP-KIT: DOORS Command
 * DOORS principles quick check
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import boxen from 'boxen';

const DOORS_QUESTIONS = [
    {
        principle: 'D - DECLARE',
        question: 'What type of door is this?',
        subQuestion: 'Is this a one-way or two-way door?',
        choices: [
            { name: '🚪 Two-way door (easily reversible)', value: 'two-way', safe: true },
            { name: '🚪 Heavy door (reversible with effort)', value: 'heavy', safe: false },
            { name: '🚪 One-way door (irreversible)', value: 'one-way', safe: false }
        ]
    },
    {
        principle: 'O - OBSERVE',
        question: 'What would close this door?',
        subQuestion: 'What events would make this irreversible?',
        choices: [
            { name: 'Clear triggers identified and monitored', value: 'clear', safe: true },
            { name: 'Some triggers identified', value: 'some', safe: false },
            { name: 'Uncertain what could lock us in', value: 'uncertain', safe: false }
        ]
    },
    {
        principle: 'O - OWN',
        question: 'Who can pull us back?',
        subQuestion: 'Is there a clear rollback owner?',
        choices: [
            { name: 'Yes, owner assigned with authority', value: 'yes', safe: true },
            { name: 'Implied but not explicit', value: 'implied', safe: false },
            { name: 'No clear owner', value: 'no', safe: false }
        ]
    },
    {
        principle: 'R - READY',
        question: 'Can we undo this tomorrow?',
        subQuestion: 'Is the rollback mechanism ready?',
        choices: [
            { name: 'Yes, tested and ready', value: 'tested', safe: true },
            { name: 'Documented but not tested', value: 'documented', safe: false },
            { name: 'No rollback plan', value: 'none', safe: false }
        ]
    },
    {
        principle: 'S - SIGNAL',
        question: 'How will we know to reverse?',
        subQuestion: 'Are tripwires defined?',
        choices: [
            { name: 'Clear signals with automated alerts', value: 'automated', safe: true },
            { name: 'Manual monitoring in place', value: 'manual', safe: false },
            { name: 'No signals defined', value: 'none', safe: false }
        ]
    }
];

export async function doorsCommand(description) {
    console.log(chalk.yellow.bold('\n🚪 RAMP-KIT: DOORS Check\n'));
    console.log(chalk.dim('"Check the DOORS before you walk through."\n'));

    // Get description if not provided
    let decisionDescription = description;
    if (!description) {
        const { desc } = await inquirer.prompt([
            {
                type: 'input',
                name: 'desc',
                message: 'What decision are you checking?',
                validate: (input) => input.length > 0 || 'Please provide a description'
            }
        ]);
        decisionDescription = desc;
    }

    console.log(chalk.dim(`\nChecking: "${decisionDescription}"\n`));

    const results = [];

    // Ask each DOORS question
    for (const door of DOORS_QUESTIONS) {
        console.log(chalk.yellow.bold(`\n${door.principle}`));
        console.log(chalk.dim(door.subQuestion));

        const { answer } = await inquirer.prompt([
            {
                type: 'list',
                name: 'answer',
                message: door.question,
                choices: door.choices.map(c => ({
                    name: c.name,
                    value: c
                }))
            }
        ]);

        results.push({
            principle: door.principle,
            answer: answer.name,
            safe: answer.safe
        });
    }

    // Calculate results
    const safeCount = results.filter(r => r.safe).length;
    const allSafe = safeCount === 5;
    const someConcerns = safeCount >= 3;

    // Display summary
    console.log('\n');

    const statusEmoji = allSafe ? '✅' : someConcerns ? '⚠️' : '🛑';
    const statusColor = allSafe ? 'green' : someConcerns ? 'yellow' : 'red';
    const statusText = allSafe ? 'DOORS Check Passed' :
        someConcerns ? 'DOORS Check: Some Concerns' :
            'DOORS Check: Action Required';

    let resultSummary = `${chalk.bold('Decision:')} ${decisionDescription}\n\n`;

    for (const r of results) {
        const icon = r.safe ? chalk.green('✓') : chalk.red('✗');
        resultSummary += `${icon} ${chalk.bold(r.principle)}\n`;
        resultSummary += `  ${chalk.dim(r.answer)}\n`;
    }

    resultSummary += `\n${chalk.bold('Score:')} ${safeCount}/5 principles satisfied`;

    if (!allSafe) {
        resultSummary += `\n\n${chalk.yellow.bold('Recommendations:')}`;
        results.forEach(r => {
            if (!r.safe) {
                resultSummary += `\n• Address ${r.principle.split(' - ')[1]} before proceeding`;
            }
        });
    }

    console.log(boxen(resultSummary, {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: statusColor,
        title: `${statusEmoji} ${statusText}`,
        titleAlignment: 'center'
    }));

    // Recommendation
    if (allSafe) {
        console.log(chalk.green('\n✅ Safe to proceed. Consider RAMP DOWN.\n'));
    } else if (someConcerns) {
        console.log(chalk.yellow('\n⚠️ Address concerns before proceeding. RAMP UP recommended.\n'));
    } else {
        console.log(chalk.red('\n🛑 Multiple DOORS concerns. Full RAMP UP required.\n'));
    }

    return { safeCount, allSafe, results };
}
