import { parallel, series, task } from 'gulp';
import { buildDemoStatic } from './build/gulp/build-demo-static.task';
import { buildLibraryTask } from './build/gulp/build-library.task';
import { bundleAssetsTask } from './build/gulp/bundle-assets.task';
import { bundleStyleFilesTask } from './build/gulp/bundle-style-files.task';
import { createBarrelFilesTask } from './build/gulp/create-barrel-files.task';
import { createUntrackedFilesTask } from './build/gulp/create-untracked-files.task';
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

task('create:untracked-files', createUntrackedFilesTask());

task('build-demo-static', buildDemoStatic());
