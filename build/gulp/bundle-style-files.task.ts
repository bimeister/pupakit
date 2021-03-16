import { copyFolderWithFiles } from '@bimeister/utilities';
import { executeCommandWithLogging } from '@bimeister/utilities/commonjs/lib/terminal/execute-command-with-logging.function';
import { info } from 'fancy-log';
import { series, TaskFunction } from 'gulp';

export function bundleStyleFilesTask(): TaskFunction {
  return series(bundleScssFiles(), copyStylesToDistFolder(), processScssFiles());
}

function bundleScssFiles(): TaskFunction {
  const command: string = 'scss-bundle --config scss-bundle.config.json';

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: false
    });
  };
}

function processScssFiles(): TaskFunction {
  const command: string = 'sass ./dist/lib/styles.scss ./dist/lib/styles.css';

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: false
    });
  };
}

function copyStylesToDistFolder(): TaskFunction {
  return (onDone: VoidFunction): void => {
    copyFolderWithFiles('./src/styles', './dist/lib/styles', {
      onCopy: (sourcePath: string, targetPath: string) => {
        info({
          sourcePath,
          targetPath
        });
      }
    });
    onDone();
  };
}
