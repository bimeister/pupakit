import { VOID } from '@bimeister/utilities/constants';
import { log } from 'console';
import { existsSync, Stats } from 'fs';
import { copyFile, mkdir, readdir, stat } from 'fs/promises';
import { basename, join } from 'path';

interface FileOrFolder {
  stats: Stats;
  path: string;
  name: string;
}
export async function copyRecursive(sourcePath: string, targetPath: string): Promise<void> {
  if (!existsSync(targetPath)) {
    return await mkdir(targetPath, {
      recursive: true,
    }).then(() => VOID);
  }

  const fileOrFolderPaths: string[] = await readdir(sourcePath).then((fileOrFolderNames: string[]) =>
    fileOrFolderNames.map((name: string) => join(sourcePath, name))
  );
  const filesOrFolders: FileOrFolder[] = await Promise.all(
    fileOrFolderPaths.map(async (path: string) => {
      const stats: Stats = await stat(path);
      const name: string = basename(path);
      return { stats, path, name };
    })
  );

  return Promise.all(
    filesOrFolders.map(async ({ stats, path, name }: FileOrFolder) => {
      const resultTargetPath: string = join(targetPath, name);

      if (stats.isFile()) {
        return await copyFile(path, resultTargetPath).then(() => log(`[COPIED] ${path} ≫ ${resultTargetPath}`));
      }

      if (!stats.isDirectory()) {
        throw new Error(`There is something strange on path: ${path} — not a file and not a directory.`);
      }

      if (!existsSync(resultTargetPath)) {
        return await mkdir(resultTargetPath, {
          recursive: true,
        });
      }

      await copyRecursive(path, resultTargetPath);
    })
  ).then(() => VOID);
}
