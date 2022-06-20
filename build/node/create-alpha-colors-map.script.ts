import { readFile, writeFile } from 'fs/promises';
import { ColorsConfig } from '../../projects/kit/src/internal/declarations/interfaces/colors-config.interface';

async function writeContentToFile(fileData: string): Promise<void> {
  await writeFile('./projects/kit/src/styles/maps/alpha-colors.map.scss', fileData, null);
}

async function getAlphaColorsMapScssFileContent(): Promise<string> {
  return await readFile('./projects/kit/src/assets/configs/alpha-colors-config.json', { encoding: 'utf8' })
    .then((content: string) => JSON.parse(content))
    .then((alphaValues: ColorsConfig.AlphaValue[]) => {
      const alphaColorsMapElements: string[] = alphaValues.map(
        (alphaValue: ColorsConfig.AlphaValue) => `'${alphaValue.name}': ${alphaValue.value / 100}`
      );

      const emptyFileContent: string =
        '/** @file Automatically generated by create-alpha-colors-map.script.ts. Edit alpha-colors-config.json*/\n';
      const colorsMapElementsString: string = alphaColorsMapElements.join(',\n  ');
      return `${emptyFileContent}\n$alphaColorsMap: (\n  ${colorsMapElementsString},\n);\n`;
    });
}

Promise.resolve()
  .then(() => getAlphaColorsMapScssFileContent())
  .then((fileData: string) => writeContentToFile(fileData));
