/**
 * @packageDocumentation
 * @module FileSystem
 */
import { isNil, Nullable } from '@bimeister/utilities';
import { copyFile, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import * as path from 'path';

interface Options {
  fileMatchPattern?: Nullable<RegExp>;
  onCopy?: Nullable<(sourcePath?: string, targetPath?: string) => void>;
}

export function copyFolderWithFiles(sourcePath: string, targetPath: string, options: Nullable<Options> = null): void {
  const { onCopy, fileMatchPattern }: Options = isNil(options) ? { onCopy: null, fileMatchPattern: null } : options;

  const sourceIsDirectory: boolean = existsSync(sourcePath) && statSync(sourcePath).isDirectory();
  const targetDirectoryExists: boolean = existsSync(targetPath);

  if (sourceIsDirectory && !targetDirectoryExists) {
    mkdirSync(targetPath, { recursive: true });
  }

  if (sourceIsDirectory) {
    readdirSync(sourcePath).forEach((filePath: string) => {
      const shouldCopy: boolean =
        isNil(fileMatchPattern) || (fileMatchPattern instanceof RegExp && fileMatchPattern.test(filePath));
      if (!shouldCopy) {
        return;
      }

      copyFolderWithFiles(path.join(sourcePath, filePath), path.join(targetPath, filePath), options);
    });
    return;
  }

  copyFile(sourcePath, targetPath, () => {
    if (!isNil(onCopy) && typeof onCopy === 'function') {
      onCopy(sourcePath, targetPath);
    }
  });
}
