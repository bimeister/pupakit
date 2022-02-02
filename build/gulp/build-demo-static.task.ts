import { info } from 'fancy-log';
import { series, TaskFunction } from 'gulp';
import { copyFolderWithFiles } from '../copy-folder-with-files';
import { executeCommandWithLogging } from '../execute-command-with-logging';

export function buildDemoStatic(): TaskFunction {
  return series(buildDemo(), bundleAssetsTask(), copyStylesToDistFolder(), replaceAssetsUrlsInStyles());
}

function buildDemo(): TaskFunction {
  const command: string = 'yarn run build:demo --baseHref #';

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: false,
    });
  };
}

function bundleAssetsTask(): TaskFunction {
  return (onDone: VoidFunction): void => {
    copyFolderWithFiles('./src/assets', './dist/demo/assets', {
      onCopy: (sourcePath: string, targetPath: string) => {
        info({
          sourcePath,
          targetPath,
        });
      },
    });
    onDone();
  };
}

function copyStylesToDistFolder(): TaskFunction {
  return (onDone: VoidFunction): void => {
    copyFolderWithFiles('./src/styles', './dist/demo/styles', {
      onCopy: (sourcePath: string, targetPath: string) => {
        info({
          sourcePath,
          targetPath,
        });
      },
    });
    onDone();
  };
}

function replaceAssetsUrlsInStyles(): TaskFunction {
  const command: string = `replace-in-file \"//assets/g\" \"assets\" ./dist/demo/styles.css --verbose --isRegex`;

  return (onDone: VoidFunction): void => {
    executeCommandWithLogging(command, {
      onDone,
      printDefaultOutput: false,
    });
  };
}
