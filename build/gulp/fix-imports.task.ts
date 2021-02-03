import { executeCommandWithLogging } from '@bimeister/utilities/commonjs/lib/terminal/execute-command-with-logging.function';
import { TaskFunction } from 'gulp';

export function fixImportsTask(): TaskFunction {
  const command: string = `replace-in-file \"/'/assets//g\" \"'~@bimeister/pupakit/assets/\" ./dist/**/**.* --verbose --isRegex`;

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: false
    });
  };
}
