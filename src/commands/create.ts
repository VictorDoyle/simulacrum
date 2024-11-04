import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

interface TemplateConfig {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
  routes: Array<{ path: string; component: string }>;
  features: Record<string, boolean>;
}

export async function create(templateName: string, projectName: string, isTypescript: boolean) {
  // some templates will have a -js and -ts suffix for user choice 
  const typeSuffix = isTypescript ? '-ts' : '-js';
  const templatePath = path.join(__dirname, '..', 'templates', templateName + typeSuffix);
  const targetPath = path.resolve(process.cwd(), projectName);

  try {
    // read config for specific template
    const templateJsonPath = path.join(templatePath, 'template.json');
    console.log(chalk.blue('Reading template configuration...'));

    if (!fs.existsSync(templateJsonPath)) {
      throw new Error(`Template configuration not found at: ${templateJsonPath}`);
    }

    const templateConfig: TemplateConfig = await fs.readJson(templateJsonPath);
    console.log(chalk.blue(`Creating project directory: ${projectName}`));
    await fs.mkdir(targetPath);

    // copy over template files -- keep this for v1 && bypass build
    console.log(chalk.blue('Copying template files...'));
    const templateFilesPath = path.join(templatePath, 'template');
    await fs.copy(templateFilesPath, targetPath, { overwrite: true });

    console.log(chalk.blue('Generating package.json...'));
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      private: true,
      dependencies: templateConfig.dependencies,
      devDependencies: templateConfig.devDependencies,
      scripts: templateConfig.scripts,
    };

    await fs.writeJson(
      path.join(targetPath, 'package.json'),
      packageJson,
      { spaces: 2 }
    );

    // install deps
    console.log(chalk.blue('\nInstalling dependencies...\n'));
    execSync('npm install', { stdio: 'inherit', cwd: targetPath });

    console.log(chalk.green('\n✨ Project created successfully!'));
    console.log('\nTo get started:');
    console.log(chalk.cyan(`\n  cd ${projectName}`));
    console.log(chalk.cyan('  npm start\n'));

  } catch (error) {
    console.error(chalk.red('Error creating project:'), error);
    // if failed then cleanup
    if (fs.existsSync(targetPath)) {
      await fs.remove(targetPath);
    }
    process.exit(1);
  }
}
