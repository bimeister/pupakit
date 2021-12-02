import { copyFolderWithFiles } from '@bimeister/utilities';
import { info } from 'fancy-log';
import { TaskFunction } from 'gulp';

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
