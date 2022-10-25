import { existsSync, Stats } from 'fs';
import { stat } from 'fs/promises';
import { copyRecursive } from './copy-recursive';

async function copyStylesToDistFolder(): Promise<void> {
  const sourcePath: string = '../common/src/styles/';
  const targetPath: string = 'dist/styles';

  if (!existsSync(sourcePath)) {
    throw new Error('Source path does not exit.');
  }

  const sourceStats: Stats = await stat(sourcePath);
  if (!sourceStats.isDirectory()) {
    throw new Error('There is no directory on the source path.');
  }

  await copyRecursive(sourcePath, targetPath);
}

Promise.resolve().then(() => copyStylesToDistFolder());
