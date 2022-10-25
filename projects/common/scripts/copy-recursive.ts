import { existsSync, Stats } from 'fs';
import { copyFile, mkdir, readdir, stat } from 'fs/promises';
import { basename, join } from 'path';

const enum Type {
  File = 'File',
  Folder = 'Folder',
  Unknown = 'Unknown',
}

interface Entry<T extends Type = Type> {
  stats: Stats;
  path: string;
  resultPath: string;
  name: string;
  type: T;
}

type FoldersAndFiles = [Entry<Type.Folder>[], Entry<Type.File>[]];

export async function copyRecursive(sourcePath: string, targetPath: string): Promise<void> {
  if (!existsSync(targetPath)) {
    await mkdir(targetPath, {
      recursive: true,
    });
  }

  const fileOrFolderPaths: string[] = await readdir(sourcePath).then((fileOrFolderNames: string[]) =>
    fileOrFolderNames.map((name: string) => join(sourcePath, name))
  );
  const filesOrFolders: Entry[] = await Promise.all(
    fileOrFolderPaths.map(async (path: string) => {
      const stats: Stats = await stat(path);
      const name: string = basename(path);
      const type: Type = getType(stats);
      const resultPath: string = join(targetPath, name);
      return { stats, path, name, type, resultPath };
    })
  );

  const [groupedFolders, groupedFiles]: FoldersAndFiles = filesOrFolders.reduce(
    (accumulatedValue: FoldersAndFiles, currentEntry: Entry) => {
      const [folders, files]: FoldersAndFiles = accumulatedValue;

      if (isFile(currentEntry)) {
        files.push(currentEntry);
      }

      if (isFolder(currentEntry)) {
        folders.push(currentEntry);
      }

      return accumulatedValue;
    },
    [[], []]
  );

  await Promise.all(
    groupedFolders.map(async ({ resultPath }: Entry<Type.Folder>) => {
      if (existsSync(resultPath)) {
        return;
      }

      await mkdir(resultPath, {
        recursive: true,
      });
    })
  );

  await Promise.all(
    groupedFiles.map(async ({ resultPath, path }: Entry<Type.File>) => await copyFile(path, resultPath))
  );

  await Promise.all(
    groupedFolders.map(async ({ path, resultPath }: Entry<Type.Folder>) => await copyRecursive(path, resultPath))
  );
}

function getType(stats: Stats): Type {
  if (stats.isFile()) {
    return Type.File;
  }

  if (stats.isDirectory()) {
    return Type.Folder;
  }

  return Type.Unknown;
}

function isFile(entry: Entry): entry is Entry<Type.File> {
  return entry.type === Type.File;
}

function isFolder(entry: Entry): entry is Entry<Type.Folder> {
  return entry.type === Type.Folder;
}
