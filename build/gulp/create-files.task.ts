import { parallel, TaskFunction } from 'gulp';
import { createAdaptiveVariablesTask } from './create-adaptive-variables.task';
import { createBarrelFilesTask } from './create-barrel-files.task';

export function createFilesTask(): TaskFunction {
  return parallel(createBarrelFilesTask(), createAdaptiveVariablesTask());
}
