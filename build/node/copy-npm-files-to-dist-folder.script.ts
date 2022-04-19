import { copyFile } from 'fs/promises';
import { join } from 'path';

async function copyNpmFilesToDistFolder(): Promise<void> {
  const npmrcPath: string = './.npmrc';
  const npmignorePath: string = './.npmignore';
  const targetPath: string = './dist/lib/';

  await copyFile(npmrcPath, join(targetPath, npmrcPath));
  await copyFile(npmignorePath, join(targetPath, npmignorePath));
}

Promise.resolve().then(() => copyNpmFilesToDistFolder());
