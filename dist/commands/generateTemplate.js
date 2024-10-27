"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTemplate = generateTemplate;
const child_process_1 = require("child_process");
const fetchTemplate_1 = require("../utils/fetchTemplate");
function generateTemplate(template) {
    console.log(`Generating a new ${template} project...`);
    (0, fetchTemplate_1.fetchTemplate)(template)
        .then(() => {
        console.log(`${template} project has been created successfully!`);
        const templateDir = `src/templates/${template}`;
        (0, child_process_1.exec)(`npm install`, { cwd: templateDir }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error installing dependencies: ${error.message}`);
                return;
            }
            console.log(stdout);
            (0, child_process_1.exec)(`npm start`, { cwd: templateDir }, (error, stdout, stderr) => {
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
