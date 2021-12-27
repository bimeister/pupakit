import { isNil } from '@bimeister/utilities';
import { info } from 'console';
import { readFile, writeFile } from 'fs';
import { TaskFunction } from 'gulp';
import { Observable, of, Subscriber, TeardownLogic } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';

const ADAPTIVE_CONFIG_PATH: string = './src/assets/configs/adaptive-config.json';
const ADAPTIVE_VARIABLES_PATH: string = './src/styles/variables/adaptive.variables.scss';

export function createAdaptiveVariablesTask(): TaskFunction {
  return (onDone: VoidFunction): void => {
    getAdaptiveVariablesData()
      .pipe(
        switchMap((fileData: string) => writeAdaptiveVariablesToFile(fileData)),
        catchError((error: Error) => of(error)),
        take(1)
      )
      .subscribe(
        (doneMessage: string) => {
          info(doneMessage);
          onDone();
        },
        (error: Error) => {
          throw error;
        }
      );
  };
}

function getAdaptiveVariablesData(): Observable<string> {
  return new Observable((subscriber: Subscriber<string>): TeardownLogic => {
    readFile(ADAPTIVE_CONFIG_PATH, { encoding: 'utf8' }, (error: NodeJS.ErrnoException | null, data: string) => {
      if (!isNil(error)) {
        subscriber.error(error);
      } else {
        const fileData: object = JSON.parse(data);

        const emptyFileContent: string = '/** @file Automatically generated by createAdaptiveVariables gulp task. */\n';

        const breakpoints: string = getVariablesWithPostfix(fileData['breakpoints'], 'BreakPoint');
        const columns: string = getVariablesWithPostfix(fileData['columns'], 'ColumnsCount');
        const gutters: string = getVariablesWithPostfix(fileData['gutters'], 'Gutter');
        const offsets: string = getVariablesWithPostfix(fileData['offsets'], 'Offset');

        const targetFileContent: string = `${emptyFileContent}\n${breakpoints}\n${columns}\n${gutters}\n${offsets}`;

        subscriber.next(targetFileContent);
      }
    });
  });
}

function writeAdaptiveVariablesToFile(fileData: string): Observable<string> {
  return new Observable((subscriber: Subscriber<string>): TeardownLogic => {
    const doneMessage: string = 'adaptive variables is rewritten.';
    writeFile(ADAPTIVE_VARIABLES_PATH, fileData, null, (error: NodeJS.ErrnoException | null) =>
      isNil(error) ? subscriber.next(doneMessage) : subscriber.error(error)
    );
  });
}

function getVariablesWithPostfix(data: Record<string, number>, postfix: string = ''): string {
  return Object.keys(data).reduce(
    (accumulator: string, dataKey: string) => accumulator + `$${dataKey}${postfix}: ${data[dataKey]};\n`,
    ''
  );
}
