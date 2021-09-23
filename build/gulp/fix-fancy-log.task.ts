import { isNil } from '@bimeister/utilities/commonjs';
import { info } from 'fancy-log';
import { readFile, writeFile } from 'fs';
import { TaskFunction } from 'gulp';
import { Observable, of, Subscriber, TeardownLogic } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';

export function fixFancyLogTask(): TaskFunction {
  const fancyLogDirPackageJson: string = './node_modules/fancy-log/package.json';

  const targetChangedKey: string = 'browser';
  const targetChangedData: object = { console: false };

  const newFileData$: Observable<string> = new Observable((subscriber: Subscriber<string>): TeardownLogic => {
    readFile(fancyLogDirPackageJson, { encoding: 'utf8' }, (error: NodeJS.ErrnoException | null, data: string) => {
      if (!isNil(error)) {
        subscriber.error(error);
      } else {
        const fileData: object = JSON.parse(data);

        const fileMap: Map<string, unknown> = new Map<string, unknown>(Object.entries(fileData));
        const browserData: unknown | undefined = fileMap.get(targetChangedKey);

        !isNil(browserData) && typeof browserData === 'object'
          ? fileMap.set(targetChangedKey, { ...browserData, ...targetChangedData })
          : fileMap.set(targetChangedKey, { ...targetChangedData });

        const newFileData: object = Array.from(fileMap.entries()).reduce(
          (accumulator: object, [key, value]: [string, unknown]) => {
            return { ...accumulator, [key]: value };
          },
          {}
        );

        const targetFileContent: string = JSON.stringify(newFileData);
        subscriber.next(targetFileContent);
      }
    });
  });

  const writeFileCallBack: (newFileData: string) => Observable<string> = (newFileData: string) => {
    return new Observable((subscriber: Subscriber<string>): TeardownLogic => {
      const doneMessage: string = 'fancy-log internal module package.json is rewritten.';
      writeFile(fancyLogDirPackageJson, newFileData, null, (error: NodeJS.ErrnoException | null) =>
        isNil(error) ? subscriber.next(doneMessage) : subscriber.error(error)
      );
    });
  };

  return (onDone: VoidFunction): void => {
    newFileData$
      .pipe(
        switchMap(writeFileCallBack),
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
