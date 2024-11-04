#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { create } from './commands/create';

const program = new Command();

program
  .name('simulate')
  .description('CLI to generate React applications')
  .version('1.0.0');

// e-commerce template
program
  .command('shop')
  .description('Create a new shop template')
  .argument('[name]', 'Name of the project', 'my-shop')
  .action(async (name) => {
    console.log(chalk.blue(`Creating new shop project: ${name}`));

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'isTypescript',
        message: 'Do you want this project in TypeScript?',
        default: true,
      },
    ]);

    try {
      await create('shop', name, answers.isTypescript);
    } catch (error) {
      console.error(chalk.red('Error creating project:'), error);
      process.exit(1);
    }
  });

program.parse(process.argv);
