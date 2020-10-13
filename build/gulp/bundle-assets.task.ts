import { executeCommandWithLogging } from '@meistersoft/utilities';
import { TaskFunction } from 'gulp';

export function bundleAssetsTask(): TaskFunction {
  const command: string = 'copy ./src/assets/**/*.* ./dist/@meistersoft/pupakit/assets';

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: false
    });
  };
}
