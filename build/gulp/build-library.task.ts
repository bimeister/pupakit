import { TaskFunction } from 'gulp';
import { executeCommandWithLogging } from '../execute-command-with-logging';

export function buildLibraryTask(): TaskFunction {
  const command: string = 'ng build';

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: false,
    });
  };
}
