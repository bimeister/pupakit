import { env } from 'process';
import { copyFile, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const NPM_AUTH_TOKEN: string = `${env.AUTH_TOKEN}`;
const CURRENT_LOCATION: string = `${__dirname}`;

async function createNpmRc(): Promise<void> {
  const npmrcPath: string = './.npmrc';
  const authToken: string = `${NPM_AUTH_TOKEN}`;
  const orgEmail: string = 'info@bimeister.com';
  const registry: string = `https://npm.pkg.github.com/:_authToken=${NPM_AUTH_TOKEN}`;

  const npmRcPath: string = join(CURRENT_LOCATION, npmrcPath);
  const npmRcContentLines: string[] = await readFile(npmRcPath, 'utf-8').then((content: string) =>
    content.split(/\r?\n/)
  );

  const currentContentEntries: [string, string][] = npmRcContentLines.map((line: string): [string, string] => {
    const dividedLine: string[] = line.split('=');

    const invalidKeyValuePair: boolean = dividedLine.length !== 2;
    if (invalidKeyValuePair) {
      return ['', ''];
    }

    const [rawKey, rawValue]: string[] = dividedLine;
    const key: string = String(rawKey).trim();
    const value: string = String(rawValue).trim();

    return [key, value];
  });

  const currentContentValueByKey: Map<string, string> = new Map<string, string>(currentContentEntries);

  currentContentValueByKey.set('_auth', authToken);
  currentContentValueByKey.set('email', orgEmail);

  const sourceRegistryWithTrailingSlash: string = registry.endsWith('/') ? registry : `${registry}/`;
  currentContentValueByKey.set('registry', sourceRegistryWithTrailingSlash);
  const processedSourceRegistry: string = sourceRegistryWithTrailingSlash
    .replace('http://', '')
    .replace('https://', '');
  currentContentValueByKey.set(`//${processedSourceRegistry}:_authToken`, authToken);

  currentContentValueByKey.forEach((_: string, key: string) => {
    const isScopedRegistry: boolean = key.startsWith('@');
    if (!isScopedRegistry) {
      return;
    }
    currentContentValueByKey.delete(key);
  });

  const updatedContent: string = Array.from(currentContentValueByKey.entries())
    .map(([key, value]: [string, string]) => `${key} = ${value}`)
    .join('\n');

  await writeFile(`${CURRENT_LOCATION}/dist/${npmrcPath}`, updatedContent);
}

Promise.resolve()
  .then(() => copyFile('./.npmrc', './dist/.npmrc'))
  .then(() => createNpmRc());
