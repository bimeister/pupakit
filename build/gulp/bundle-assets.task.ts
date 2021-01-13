import { executeCommandWithLogging } from '@bimeister/utilities/common';
import { TaskFunction } from 'gulp';

export function bundleAssetsTask(): TaskFunction {
  const command: string = 'copy ./src/assets/**/*.* ./dist/lib/assets';

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: false
    });
  };
}
