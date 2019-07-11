type FunctionSignature = (entity: unknown) => boolean;

export const isNullOrUndefined: FunctionSignature = (entity: unknown): boolean => {
  return entity === null || entity === undefined;
};
