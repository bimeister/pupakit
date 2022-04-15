import { parallel, TaskFunction } from 'gulp';
import { createColorsMapTask } from './create-colors-map.task';

export function createUntrackedFilesTask(): TaskFunction {
  return parallel(createColorsMapTask());
}
