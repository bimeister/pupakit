import { parallel, series, task } from 'gulp';

import { buildLibraryTask } from './build/build-library.task';
import { bundleAssetsTask } from './build/bundle-assets.task';
import { bundleStyleFilesTask } from './build/bundle-style-files.task';
import { createBarrelFilesTask } from './build/create-barrel-files.task';
import { fixImportsTask } from './build/fix-imports.task';

task(
  'build',
  series(
    createBarrelFilesTask(),
    buildLibraryTask(),
    parallel(bundleAssetsTask(), bundleStyleFilesTask()),
    fixImportsTask()
  )
);
