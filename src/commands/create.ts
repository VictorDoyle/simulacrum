import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

interface TemplateConfig {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
  routes: Array<{ path: string; component: string }>;
  features: Record<string, boolean>;
}

async function promptUserForProjectDetails(features: string[]) {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'author',
      message: 'Enter the author name:',
      default: 'Your Name',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Enter project description:',
      default: 'A new project',
    },
    {
      type: 'input',
      name: 'license',
      message: 'Enter project license (e.g., MIT):',
      default: 'MIT',
    },
    {
      type: 'checkbox',
      name: 'features',
      message: 'Select features to include:',
      // dynamic from template.json
      choices: features,
    },
    {
      type: 'confirm',
      name: 'initializeGit',
      message: 'Initialize a Git repository?',
      default: true,
    },
  ]);
}

export async function create(templateName: string, projectName: string, isTypescript: boolean) {
  const typeSuffix = isTypescript ? '-ts' : '-js';
  const templatePath = path.join(__dirname, '..', 'templates', templateName + typeSuffix);
  const targetPath = path.resolve(process.cwd(), projectName);

  try {
    const templateJsonPath = path.join(templatePath, 'template.json');
    console.log(chalk.blue('Reading template configuration...'));

    if (!fs.existsSync(templateJsonPath)) {
      throw new Error(`Template configuration not found at: ${templateJsonPath}`);
    }

    const templateConfig: TemplateConfig = await fs.readJson(templateJsonPath);

    // import feature names from template config
    const featureNames = Object.keys(templateConfig.features).filter(feature => templateConfig.features[feature]);
    const projectDetails = await promptUserForProjectDetails(featureNames);

    console.log(chalk.blue(`Creating project directory: ${projectName}`));
    await fs.mkdir(targetPath);

    console.log(chalk.blue('Copying template files...'));
    const templateFilesPath = path.join(templatePath, 'template');
    await fs.copy(templateFilesPath, targetPath, { overwrite: true });

    console.log(chalk.blue('Generating package.json...'));
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      private: true,
      description: projectDetails.description,
      author: projectDetails.author,
      license: projectDetails.license,
      dependencies: templateConfig.dependencies,
      devDependencies: templateConfig.devDependencies,
      scripts: templateConfig.scripts,
    };

    await fs.writeJson(
      path.join(targetPath, 'package.json'),
      packageJson,
      { spaces: 2 }
    );

    // check dependency install location 
    console.log(chalk.blue('Installing all dependencies in:'), targetPath);
    execSync('npm install', { stdio: 'inherit', cwd: targetPath });

    // checkmark each dependency to be 100% sure all is installed
    // TODO: build retry when install fails or defer until template loaded then webpack build
    const allDependencies = { ...templateConfig.dependencies, ...templateConfig.devDependencies };
    console.log(chalk.blue('\nVerifying installed dependencies:'));
    for (const dep of Object.keys(allDependencies)) {
      const depPath = path.join(targetPath, 'node_modules', dep);
      if (fs.existsSync(depPath)) {
        console.log(chalk.green(`✓ ${dep} installed successfully`));
      } else {
        console.log(chalk.red(`✗ ${dep} failed to install`));
      }
    }

    console.log(chalk.green('\n✨ Project created successfully!'));
    console.log(chalk.underline("You've saved between 5 to 360 minutes making a website's basic setup "));
    console.log('\nTo get started:');
    console.log(chalk.cyan(`\n  cd ${projectName}`));
    console.log(chalk.cyan('  npm start\n'));

  } catch (error) {
    console.error(chalk.red('Error creating project:'), error);
    if (fs.existsSync(targetPath)) {
      await fs.remove(targetPath);
    }
    process.exit(1);
  }
}
