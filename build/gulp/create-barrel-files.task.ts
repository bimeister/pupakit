import { executeCommandWithLogging } from '@bimeister/utilities/commonjs/lib/terminal/execute-command-with-logging.function';
import { parallel, TaskFunction } from 'gulp';

export function createBarrelFilesTask(): TaskFunction {
  return parallel(createForComponents(), createForInternal());
}

function createForComponents(): TaskFunction {
  const command: string = 'barrelsby --config="./barrelsby.json" --directory="./src/lib/components"';

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: false
    });
  };
}

function createForInternal(): TaskFunction {
  const command: string = 'barrelsby --config="./barrelsby.json" --directory="./src/internal"';

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: false
    });
  };
}
