import { parallel, series, task } from 'gulp';
import { buildIconsTask } from './build/gulp/build-icons.task';
import { buildLibraryTask } from './build/gulp/build-library.task';
import { bundleAssetsTask } from './build/gulp/bundle-assets.task';
import { bundleStyleFilesTask } from './build/gulp/bundle-style-files.task';
import { createBarrelFilesTask } from './build/gulp/create-barrel-files.task';
import { fixImportsTask } from './build/gulp/fix-imports.task';

task(
  'build',
  series(
    createBarrelFilesTask(),
    buildLibraryTask(),
    parallel(bundleAssetsTask(), bundleStyleFilesTask()),
    fixImportsTask()
  )
);

task('create:barrel-files', createBarrelFilesTask());

task('convert-icons-to-code', buildIconsTask());
