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
    try {
        const { data } = await axios_1.default.get(url, {
            headers: {
                Accept: 'application/vnd.github.v3+json',
            },
        });
        // Check if the response is an array of files
        if (Array.isArray(data)) {
            await fs_1.promises.mkdir(destPath, { recursive: true });
            await Promise.all(data.map(async (file) => {
                const filePath = path_1.default.join(destPath, file.name);
                const fileContent = await axios_1.default.get(file.download_url);
                await fs_1.promises.writeFile(filePath, fileContent.data);
            }));
        }
    }
    catch (err) {
        throw new Error(`Could not fetch template: ${err}`);
    }
}
