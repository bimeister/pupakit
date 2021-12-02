import { isNil } from '@bimeister/utilities';

export const getPropertyValueByPath = (source: unknown, path: string): unknown => {
  if (isNil(source) || isNil(path)) {
    return null;
  }

  const pathKeys: string[] = String(path).split('.');
  if (!Array.isArray(pathKeys)) {
    return null;
  }

  return pathKeys.reduce((extractedData: any, _: string, currentIndex: number) => {
    const currentPath: string = pathKeys[currentIndex];
    const currentPathData: any = extractedData[currentPath];
    return currentPathData;
  }, source);
};
