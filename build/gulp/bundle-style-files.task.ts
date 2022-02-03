import { info } from 'fancy-log';
import { series, TaskFunction } from 'gulp';
import { copyFolderWithFiles } from '../copy-folder-with-files';
import { executeCommandWithLogging } from '../execute-command-with-logging';

export function bundleStyleFilesTask(): TaskFunction {
  return series(processScssFiles(), copyStylesToDistFolder());
}

function processScssFiles(): TaskFunction {
  const command: string = 'sass --load-path=node_modules ./projects/kit/src/styles/styles.scss ./dist/lib/styles.css';

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: false,
    });
  };
}

function copyStylesToDistFolder(): TaskFunction {
  return (onDone: VoidFunction): void => {
    copyFolderWithFiles('./projects/kit/src/styles', './dist/lib/styles', {
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
