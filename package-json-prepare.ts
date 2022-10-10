import { env } from 'process';
import { readFile, writeFile } from 'fs/promises';
import { isEmpty } from '@bimeister/utilities';

const GIT_COMMIT_HASH: string = `${env.GIT_COMMIT_HASH}`;
const CURRENT_LOCATION: string = `${__dirname}`;

async function createPackageJson(): Promise<void> {
  const commitHash: string = `${GIT_COMMIT_HASH}`;
  const packageJsonPath: string = './dist/package.json';

  const currentContent: object = await readFile(`${CURRENT_LOCATION}/${packageJsonPath}`, 'utf-8').then(
    (content: string) => (isEmpty(content) ? {} : JSON.parse(content))
  );
  const currentContentEntries: [string, unknown][] = Object.entries(currentContent);

  const contentValueByKey: Map<string, unknown> = new Map<string, unknown>(
    currentContentEntries.map(([key, value]: [string, unknown]) => [key, value])
  );

  const currentProperVersion: unknown = contentValueByKey.get('version');
  const updatedProperVersion: string = `${currentProperVersion}-${commitHash}`;
  contentValueByKey.set('version', updatedProperVersion);

  const updatedContent: object = Object.fromEntries(contentValueByKey.entries());

  await writeFile(`${CURRENT_LOCATION}/${packageJsonPath}`, JSON.stringify(updatedContent));
}

Promise.resolve().then(() => createPackageJson());
