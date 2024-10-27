import { exec } from 'child_process';
import { fetchTemplate } from '../utils/fetchTemplate';

export function generateTemplate(template: string): void {
  console.log(`Generating a new ${template} project...`);

  fetchTemplate(template)
    .then(() => {
      console.log(`${template} project has been created successfully!`);
      const templateDir = `src/templates/${template}`;

      exec(`npm install`, { cwd: templateDir }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error installing dependencies: ${error.message}`);
          return;
        }
        console.log(stdout);

        exec(`npm start`, { cwd: templateDir }, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error starting the project: ${error.message}`);
            return;
          }
          console.log(stdout);
        });
      });
    })
    .catch((err) => {
      console.error(`Failed to generate template: ${err.message}`);
    });
}
