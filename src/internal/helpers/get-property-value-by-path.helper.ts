import { isNullOrUndefined } from './is-null-or-undefined.helper';

export const getPropertyValueByPath = (source: unknown, path: string): unknown => {
  if (isNullOrUndefined(source) || isNullOrUndefined(path)) {
    return null;
  }

  const pathKeys: string[] = String(path).split('.');
  if (!Array.isArray(pathKeys)) {
    return null;
  }

  return pathKeys.reduce((extractedData: any, _, currentIndex: number) => {
    const currentPath: string = pathKeys[currentIndex];
    const currentPathData: any = extractedData[currentPath];
    return currentPathData;
  }, source);
};
