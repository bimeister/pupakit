export const constructWorkerFromFunction = (main: Function, options?: WorkerOptions): Worker => {
  const stringifiedMain: string = main.toString().match(/^\s*function\s*\(\s*\)\s*\{(([\s\S](?!\}$))*[\s\S])/)[1];
  const stringifiedMainUrl: string = globalThis.URL.createObjectURL(
    new Blob([stringifiedMain], { type: 'text/javascript' })
  );
  return new Worker(stringifiedMainUrl, options);
};
