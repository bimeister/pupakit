import { parallel, TaskFunction } from 'gulp';
import { createAdaptiveVariablesTask } from './create-adaptive-variables.task';
import { createBarrelFilesTask } from './create-barrel-files.task';
import { createColorsMapTask } from './create-colors-map.task';

export function createUntrackedFilesTask(): TaskFunction {
  return parallel(createBarrelFilesTask(), createAdaptiveVariablesTask(), createColorsMapTask());
}
