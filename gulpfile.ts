import { parallel, series, task } from 'gulp';
import { buildDemoStatic } from './build/gulp/build-demo-static.task';
import { buildLibraryTask } from './build/gulp/build-library.task';
import { bundleAssetsTask } from './build/gulp/bundle-assets.task';
import { bundleStyleFilesTask } from './build/gulp/bundle-style-files.task';

import { fixImportsTask } from './build/gulp/fix-imports.task';

task('build', series(buildLibraryTask(), parallel(bundleAssetsTask(), bundleStyleFilesTask()), fixImportsTask()));

task('build-demo-static', buildDemoStatic());
