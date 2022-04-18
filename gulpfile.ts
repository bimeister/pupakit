import { task } from 'gulp';
import { buildDemoStatic } from './build/gulp/build-demo-static.task';

task('build-demo-static', buildDemoStatic());
