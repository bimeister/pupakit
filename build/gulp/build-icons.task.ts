import { TaskFunction } from 'gulp';
import * as fs from 'fs';
import { format, Options, resolveConfig } from 'prettier';
import * as path from 'path';

interface GeneratorConfig {
  exportName: string;
  iconName: string;
  iconData: string;
  interfaceName: string;
  interfaceImportPath: string;
}

const createTargetFileContent = (config: GeneratorConfig) =>
  `import {${config.interfaceName}} from '${config.interfaceImportPath}';\n\n` +
  `export const ${config.exportName}: ${config.interfaceName} = {\n` +
  `  name: '${config.iconName}',\n` +
  `  data: \`${config.iconData}\`\n` +
  `};\n`;

const kebabToCamelName = (name: string): string => {
  return name.replace(/([-_][a-z])/gi, nameToProcess => {
    return nameToProcess.toUpperCase().replace('-', '').replace('_', '');
  });
};

export function buildIconsTask(): TaskFunction {
  const basePath: string = 'src/assets/icons';

  return async (onDone: VoidFunction): Promise<void> => {
    const config: Options = {
      ...(await resolveConfig(basePath)),
      parser: 'typescript'
    };

    for (const iconPath of fs.readdirSync(basePath)) {
      const sourceIconName: string = path.parse(iconPath).name;
      const kebabCaseName: string = `${sourceIconName}-icon`;
      const camelCaseName: string = kebabToCamelName(kebabCaseName);

      const resultFileContent: string = createTargetFileContent({
        exportName: camelCaseName,
        iconName: sourceIconName,
        iconData: fs.readFileSync(`${basePath}/${iconPath}`, 'utf-8'),
        interfaceName: 'IconDefinition',
        interfaceImportPath: '../declarations/interfaces/icon-definition.interface'
      });

      fs.writeFileSync(`src/internal/icons/${kebabCaseName}.const.ts`, format(resultFileContent, config), 'utf-8');
    }

    onDone();
  };
}
