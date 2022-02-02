import { TaskFunction } from 'gulp';
import { executeCommandWithLogging } from '../execute-command-with-logging';

export function fixImportsTask(): TaskFunction {
  const command: string = `replace-in-file \"/'/assets//g\" \"'~@bimeister/pupakit/assets/\" ./dist/**/**.* --verbose --isRegex`;

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: false,
    });
  };
}
