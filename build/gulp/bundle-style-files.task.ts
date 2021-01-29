import { executeCommandWithLogging } from '@bimeister/utilities/commonjs/common';
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
  const command: string = 'copy ./src/styles/**/**/**/*.* ./dist/lib/styles';

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: false
    });
  };
}
