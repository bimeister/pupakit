import { executeCommandWithLogging } from '@meistersoft/utilities';
import { TaskFunction } from 'gulp';

export function fixImportsTask(): TaskFunction {
  const command: string = `replace-in-file \"/'/assets//g\" \"'~@meistersoft/pupakit/assets/\" ./dist/**/**.* --verbose --isRegex`;

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: false
    });
  };
}
