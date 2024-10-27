import { exec } from 'child_process';
import { fetchTemplate } from '../utils/fetchTemplates';

export function generateTemplate(template: string): void {
  console.log(`Generating a new ${template} project...`);

  fetchTemplate(template)
    .then(() => {
      console.log(`${template} project has been created successfully!`);
      exec('npm install', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error installing dependencies: ${error.message}`);
          return;
        }
        console.log(stdout);
      });
    })
    .catch((err) => {
      console.error(`Failed to generate template: ${err.message}`);
    });
}
