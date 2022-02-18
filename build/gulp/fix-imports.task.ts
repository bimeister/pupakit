import { series, TaskFunction } from 'gulp';
import { cwd } from 'process';
import { executeCommandWithLogging } from '../execute-command-with-logging';

export function fixImportsTask(): TaskFunction {
  const targetPath: string = `${cwd()}/dist/**/*.*css`;

  const replaceWithSingleQuote = (onDone: VoidFunction): void => {
    const from: string = new RegExp(/'\/assets\//).source;
    const to: string = `'~@bimeister/pupakit/assets/`;
    const singleQuoteCommand: string = `replace-in-file "/${from}/g" "${to}" "${targetPath}" --verbose --isRegex`;
    executeCommandWithLogging(singleQuoteCommand, {
      onDone,
      printDefaultOutput: false,
    });
  };

  const replaceWithDoubleQuote = (onDone: VoidFunction): void => {
    const from: string = new RegExp(/"\/assets\//).source;
    const to: string = `"~@bimeister/pupakit/assets/`;
    const doubleQuoteCommand: string = `replace-in-file '/${from}/g' '${to}' '${targetPath}' --verbose --isRegex`;
    executeCommandWithLogging(doubleQuoteCommand, {
      onDone,
      printDefaultOutput: false,
    });
  };

  return series(replaceWithSingleQuote, replaceWithDoubleQuote);
}
