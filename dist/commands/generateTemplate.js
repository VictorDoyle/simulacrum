"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTemplate = generateTemplate;
const child_process_1 = require("child_process");
const fetchTemplates_1 = require("../utils/fetchTemplates");
function generateTemplate(template) {
    console.log(`Generating a new ${template} project...`);
    (0, fetchTemplates_1.fetchTemplate)(template)
        .then(() => {
        console.log(`${template} project has been created successfully!`);
        (0, child_process_1.exec)('npm install', (error, stdout, stderr) => {
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
