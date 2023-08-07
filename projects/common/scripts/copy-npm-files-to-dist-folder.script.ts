import { copyFile } from 'fs/promises';
import { join } from 'path';

async function copyNpmFilesToDistFolder(): Promise<void> {
  const npmrcPath: string = './.npmrc';
  const npmIgnorePath: string = './.npmignore';
  const targetPath: string = './dist';

  await copyFile(npmrcPath, join(targetPath, npmrcPath));
  await copyFile(npmIgnorePath, join(targetPath, npmIgnorePath));
}

Promise.resolve().then(() => copyNpmFilesToDistFolder());
