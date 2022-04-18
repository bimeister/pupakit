import { parallel, series, task, TaskFunction } from 'gulp';
import { executeCommandWithLogging } from './build/execute-command-with-logging';
import { buildDemoStatic } from './build/gulp/build-demo-static.task';
import { buildLibraryTask } from './build/gulp/build-library.task';

function replaceSubstrings(): TaskFunction {
  return (onDone: VoidFunction) =>
    executeCommandWithLogging('npm run replace:all', {
      onDone,
      printDefaultOutput: false,
    });
}

function bundleStaticFilesTask(): TaskFunction {
  return (onDone: VoidFunction) =>
    executeCommandWithLogging('npm run bundle:all', {
      onDone,
      printDefaultOutput: false,
    });
}

task('build', series(buildLibraryTask(), parallel(bundleStaticFilesTask()), replaceSubstrings()));

task('build-demo-static', buildDemoStatic());
