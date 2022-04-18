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
    await mkdir(targetPath, {
      recursive: true,
    });
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

  filesOrFolders.forEach(async ({ stats, path, name }: FileOrFolder) => {
    const resultTargetPath: string = join(targetPath, name);

    if (stats.isFile()) {
      await copyFile(path, resultTargetPath);
      return;
    }

    if (!stats.isDirectory()) {
      throw new Error(`There is something strange on path: ${path} — not a file and not a directory.`);
    }

    if (!existsSync(resultTargetPath)) {
      await mkdir(resultTargetPath, {
        recursive: true,
      });
    }

    await copyRecursive(path, resultTargetPath);
  });
}
