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
    const isTargetValue: boolean = Object.is(currentIndex, pathKeys.length - 1);

    if (isTargetValue) {
      return currentPathData;
    }

    if (isNullOrUndefined(currentPathData)) {
      return currentPathData;
    }
  }, source);
};
