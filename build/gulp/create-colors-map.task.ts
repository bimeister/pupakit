import { isNil } from '@bimeister/utilities';
import { info } from 'console';
import { readFile, writeFile } from 'fs';
import { TaskFunction } from 'gulp';
import { Observable, of, Subscriber, TeardownLogic } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { Color } from '../../projects/kit/src/internal/declarations/classes/color.class';
import { ColorsConfig } from '../../projects/kit/src/internal/declarations/interfaces/colors-config.interface';

const COLORS_CONFIG_PATH: string = './projects/kit/src/assets/configs/colors-config.json';
const COLORS_MAP_PATH: string = './projects/kit/src/styles/maps/colors.map.scss';

export function createColorsMapTask(): TaskFunction {
  return (onDone: VoidFunction): void => {
    getColorsMapScssFileContent()
      .pipe(
        switchMap((fileData: string) => writeContentToFile(fileData)),
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

function getColorsMapScssFileContent(): Observable<string> {
  return new Observable((subscriber: Subscriber<string>): TeardownLogic => {
    readFile(COLORS_CONFIG_PATH, { encoding: 'utf8' }, (error: NodeJS.ErrnoException | null, data: string) => {
      if (!isNil(error)) {
        subscriber.error(error);
      } else {
        const colorGroups: ColorsConfig.Group[] = JSON.parse(data);

        const colors: Color[] = [];
        for (const colorGroup of colorGroups) {
          for (const colorData of colorGroup.colors) {
            colors.push(new Color(colorData));
          }
        }

        const colorsMapElements: string[] = colors.map((color: Color) => `'${color.key}': #${color.hex}`);

        const emptyFileContent: string =
          '/** @file Automatically generated by createColorsMapTask gulp task. Edit colors-config.json*/\n';
        const colorsMapElementsString: string = colorsMapElements.join(',\n  ');
        const colorsMapContent: string = `${emptyFileContent}\n$colorsMap: (\n  ${colorsMapElementsString},\n);\n`;
        subscriber.next(colorsMapContent);
      }
    });
  });
}

function writeContentToFile(fileData: string): Observable<string> {
  return new Observable((subscriber: Subscriber<string>): TeardownLogic => {
    const doneMessage: string = 'Color variables is rewritten.';
    writeFile(COLORS_MAP_PATH, fileData, null, (error: NodeJS.ErrnoException | null) =>
      isNil(error) ? subscriber.next(doneMessage) : subscriber.error(error)
    );
  });
}
