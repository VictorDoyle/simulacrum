import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';

export async function fetchTemplate(template: string): Promise<void> {
  const url = `https://api.github.com/repos/VictorDoyle/simulacrum-themes/contents/${template}`;
  const destPath = path.join(process.cwd(), template);

  console.log(`Fetching template from: ${url}`);

  try {
    // fetch specific template
    const { data } = await axios.get(url, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    // is fdata  array of files/dirs
    if (Array.isArray(data)) {
      await fs.mkdir(destPath, { recursive: true }); // if destination doesnt exist make it

      await Promise.all(data.map(async (file) => {
        if (file.type === 'file') {
          const filePath = path.join(destPath, file.name);
          const fileResponse = await axios.get(file.download_url, { responseType: 'text' });

          await fs.writeFile(filePath, fileResponse.data); // gotta be a string so we use fileResponse.data 
          console.log(`Downloaded and saved: ${filePath}`);
        } else if (file.type === 'dir') { // if dir then recursiv to get all contents
          await fetchTemplate(path.join(template, file.name));
        }
      }));
    } else {
      throw new Error('Expected an array of files/directories from GitHub API');
    }
  } catch (err) {
    throw new Error(`Could not fetch template: ${err instanceof Error ? err.message : err}`);
  }
}
