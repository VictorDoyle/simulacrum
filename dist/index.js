"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const generateTemplate_1 = require("./commands/generateTemplate");
const program = new commander_1.Command();
program
    .name('simulacrum')
    .description('CLI to generate pre-configured project templates')
    .version('1.0.0');
program
    .command('create')
    .description('Generate a new project with routes, config and pages pre-built from a template')
    .argument('<template>', 'Type of template to generate (e.g., blog, shop)')
    .action((template) => {
    (0, generateTemplate_1.generateTemplate)(template);
});
program.parse(process.argv);
