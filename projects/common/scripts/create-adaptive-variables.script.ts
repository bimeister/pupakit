import { readFile, writeFile } from 'fs/promises';

function getVariablesWithPostfix(data: Record<string, number>, postfix: string = ''): string {
  return Object.keys(data).reduce(
    (accumulator: string, dataKey: string) => `${accumulator}$${dataKey}${postfix}: ${data[dataKey]};\n`,
    ''
  );
}

function writeAdaptiveVariablesToFile(fileData: string): Promise<void> {
  return writeFile('src/styles/variables/adaptive.variables.scss', fileData, null);
}

function getAdaptiveVariablesData(): Promise<string> {
  return readFile('src/assets/configs/adaptive-config.json', { encoding: 'utf8' })
    .then((content: string) => JSON.parse(content))
    .then((fileData: object) => {
      const emptyFileContent: string = '/** @file Automatically generated by create-adaptive-variables.script.ts */\n';

      const breakpoints: string = getVariablesWithPostfix(fileData['breakpoints'], 'BreakPoint');
      const columns: string = getVariablesWithPostfix(fileData['columns'], 'ColumnsCount');
      const gutters: string = getVariablesWithPostfix(fileData['gutters'], 'Gutter');
      const offsets: string = getVariablesWithPostfix(fileData['offsets'], 'Offset');

      return `${emptyFileContent}\n${breakpoints}\n${columns}\n${gutters}\n${offsets}`;
    });
}

Promise.resolve()
  .then(() => getAdaptiveVariablesData())
  .then((targetFileData: string) => writeAdaptiveVariablesToFile(targetFileData));
