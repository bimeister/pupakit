import { isEmpty, isNil } from '@bimeister/utilities';
import { existsSync } from 'fs';
import { copyFile, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { env } from 'process';

const IS_DEV_PUBLISH: boolean = Boolean(env.IS_DEV_PUBLISH);
const GIT_COMMIT_HASH: string | undefined = env.GIT_COMMIT_HASH;
const CURRENT_LOCATION: string = join(__dirname, 'projects');
const VERSION: string | undefined = env.VERSION;

const PUBLISH_PROJECT_FOLDERS: string[] = ['common', 'forms', 'icons', 'kit', 'overlays', 'table', 'tree', 'widgets'];

async function preparePackages(): Promise<void> {
  for (const projectPath of PUBLISH_PROJECT_FOLDERS) {
    const projectDistFolderPath: string = join(CURRENT_LOCATION, projectPath, 'dist');
    const packageJsonPath: string = join(projectDistFolderPath, 'package.json');
    await preparePackageJson(packageJsonPath);
    await copyFile('./.npmignore', join(projectDistFolderPath, '.npmignore'));
    await copyFile('./LICENSE.md', join(projectDistFolderPath, 'LICENSE.md'));
  }
}

async function preparePackageJson(targetPackageJsonPath: string): Promise<void> {
  if (!existsSync(targetPackageJsonPath)) {
    throw new Error(`Looks like you forgot run build first. Path ${targetPackageJsonPath} does not exist.`);
  }

  const currentContent: object = await readFile(targetPackageJsonPath, 'utf-8').then((content: string) =>
    Boolean(isEmpty(content)) ? {} : JSON.parse(content)
  );
  const currentContentEntries: [string, unknown][] = Object.entries(currentContent);

  const contentValueByKey: Map<string, unknown> = new Map<string, unknown>(
    currentContentEntries.map(([key, value]: [string, unknown]) => [key, value])
  );

  if (isNil(VERSION)) {
    throw new Error('Package.json version is invalid');
  }

  const metadataSuffix: string = IS_DEV_PUBLISH ? 'dev' : 'next';
  const updatedProperVersion: string = isNil(GIT_COMMIT_HASH)
    ? VERSION
    : `${VERSION}-${metadataSuffix}.sha.${GIT_COMMIT_HASH.slice(0, 8)}`;

  contentValueByKey.set('version', updatedProperVersion);
  contentValueByKey.set('private', false);

  const updatedContent: object = Object.fromEntries(contentValueByKey.entries());

  return writeFile(targetPackageJsonPath, JSON.stringify(updatedContent));
}

Promise.resolve()
  .then(() => preparePackages())
  .catch((error: unknown) => console.warn(error));
