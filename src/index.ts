import { Command } from 'commander';
import { generateTemplate } from './commands/generateTemplate';

const program = new Command();

program
  .name('simulacrum')
  .description('CLI to generate pre-configured project templates')
  .version('1.0.0');

program
  .command('create')
  .description('Generate a new project with routes, config and pages pre-built from a template')
  .argument('<template>', 'Type of template to generate (e.g., blog, shop)')
  .action((template: string) => {
    generateTemplate(template);
  });

program.parse(process.argv);
