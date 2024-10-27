"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTemplate = fetchTemplate;
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
async function fetchTemplate(template) {
    const url = `https://api.github.com/repos/VictorDoyle/simulacrum-themes/contents/${template}`;
    const destPath = path_1.default.join(process.cwd(), template);
    console.log(`Fetching template from: ${url}`);
    try {
        // Fetching the contents of the specified template directory
        const { data } = await axios_1.default.get(url, {
            headers: { Accept: 'application/vnd.github.v3+json' },
        });
        // Check if the fetched data is an array of files/directories
        if (Array.isArray(data)) {
            await fs_1.promises.mkdir(destPath, { recursive: true }); // Create the destination directory if it doesn't exist
            // Iterate over each item in the fetched data
            await Promise.all(data.map(async (file) => {
                if (file.type === 'file') { // Check if the item is a file
                    const filePath = path_1.default.join(destPath, file.name); // Create the file path
                    // Fetch the file content
                    const fileResponse = await axios_1.default.get(file.download_url, { responseType: 'text' });
                    // Write the file content to the destination
                    await fs_1.promises.writeFile(filePath, fileResponse.data); // Ensure we use fileResponse.data which should be a string
                    console.log(`Downloaded and saved: ${filePath}`);
                }
                else if (file.type === 'dir') { // If it's a directory, recursively fetch its contents
                    await fetchTemplate(path_1.default.join(template, file.name)); // Call fetchTemplate on the subdirectory
                }
            }));
        }
        else {
            throw new Error('Expected an array of files/directories from GitHub API');
        }
    }
    catch (err) {
        throw new Error(`Could not fetch template: ${err instanceof Error ? err.message : err}`);
    }
}
