import { copyFolderWithFiles } from '@bimeister/utilities';
import { executeCommandWithLogging } from '@bimeister/utilities/commonjs/lib/terminal/execute-command-with-logging.function';
import { info } from 'fancy-log';
import { series, TaskFunction } from 'gulp';

export function bundleStyleFilesTask(): TaskFunction {
  return series(processScssFiles(), copyStylesToDistFolder());
}

function processScssFiles(): TaskFunction {
  const command: string = 'sass --load-path=node_modules ./src/styles/styles.scss ./dist/lib/styles.css';

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: false,
    });
  };
}

function copyStylesToDistFolder(): TaskFunction {
  return (onDone: VoidFunction): void => {
    copyFolderWithFiles('./src/styles', './dist/lib/styles', {
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
