import { series, TaskFunction } from 'gulp';

import { executeCommandWithLogging } from './shared';

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
  const command: string = 'sass ./dist/@meistersoft/pupakit/styles.scss ./dist/@meistersoft/pupakit/styles.css';

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: false
    });
  };
}

function copyStylesToDistFolder(): TaskFunction {
  const command: string = 'copy ./src/styles/**/**/**/*.* ./dist/@meistersoft/pupakit/styles';

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: false
    });
  };
}
