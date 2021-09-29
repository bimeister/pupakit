import { executeCommandWithLogging } from '@bimeister/utilities/commonjs/lib/terminal/execute-command-with-logging.function';
import { TaskFunction } from 'gulp';

export function buildLibraryTask(): TaskFunction {
  const command: string = 'yarn run build:cache';

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: false
    });
  };
}
