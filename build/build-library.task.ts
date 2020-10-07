import { executeCommandWithLogging } from '@meistersoft/utilities';
import { TaskFunction } from 'gulp';

export function buildLibraryTask(): TaskFunction {
  const command: string = 'ng build';

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: false
    });
  };
}
