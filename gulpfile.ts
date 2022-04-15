import { parallel, series, task, TaskFunction } from 'gulp';
import { executeCommandWithLogging } from './build/execute-command-with-logging';
import { buildDemoStatic } from './build/gulp/build-demo-static.task';
import { buildLibraryTask } from './build/gulp/build-library.task';
import { bundleAssetsTask } from './build/gulp/bundle-assets.task';
import { bundleStyleFilesTask } from './build/gulp/bundle-style-files.task';

function fixImportsTask(): TaskFunction {
  return (onDone: VoidFunction) =>
    executeCommandWithLogging('npm run replace:all', {
      onDone,
      printDefaultOutput: false,
    });
}

task('build', series(buildLibraryTask(), parallel(bundleAssetsTask(), bundleStyleFilesTask()), fixImportsTask()));

task('build-demo-static', buildDemoStatic());
