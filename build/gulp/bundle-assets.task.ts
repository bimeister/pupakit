import { info } from 'fancy-log';
import { TaskFunction } from 'gulp';
import { copyFolderWithFiles } from '../copy-folder-with-files';

export function bundleAssetsTask(): TaskFunction {
  return (onDone: VoidFunction): void => {
    copyFolderWithFiles('./src/assets', './dist/lib/assets', {
      onCopy: (sourcePath: string, targetPath: string) => {
        info({
          sourcePath,
          targetPath,
        });
      },
    });
    onDone();
  };
}
