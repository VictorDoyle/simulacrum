import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';

export async function fetchTemplate(template: string): Promise<void> {
  const url = `https://api.github.com/repos/VictorDoyle/simulacrum-themes/contents/${template}`;
  const destPath = path.join(process.cwd(), template);

  try {
    const { data } = await axios.get(url, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    // Check if the response is an array of files
    if (Array.isArray(data)) {
      await fs.mkdir(destPath, { recursive: true });
      await Promise.all(data.map(async (file) => {
        const filePath = path.join(destPath, file.name);
        const fileContent = await axios.get(file.download_url);
        await fs.writeFile(filePath, fileContent.data);
      }));
    }
  } catch (err) {
    throw new Error(`Could not fetch template: ${err}`);
  }
}
