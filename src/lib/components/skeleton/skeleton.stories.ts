import { storiesOf } from '@storybook/angular';

import { SkeletonModule } from './skeleton.module';

storiesOf('Skeleton', module).add('default', () => ({
  moduleMetadata: {
    imports: [SkeletonModule]
  },
  template: `
  <style>
    .demo-wrapper {
      width: 200px;
    }
    pupa-skeleton,
    pupa-skeleton-group {
      width: 100%;
    }
  </style>
  <div class="demo-wrapper">
    <pupa-skeleton>
      <pupa-skeleton-group>
        <pupa-skeleton-line [width.px]="12"></pupa-skeleton-line>
        <pupa-skeleton-line [width.px]="120"></pupa-skeleton-line>
      </pupa-skeleton-group>

      <pupa-skeleton-group>
        <pupa-skeleton-line [width.px]="12"></pupa-skeleton-line>
        <pupa-skeleton-line [width.px]="179"></pupa-skeleton-line>
      </pupa-skeleton-group>

      <pupa-skeleton-group>
        <pupa-skeleton-line [width.px]="12"></pupa-skeleton-line>
        <pupa-skeleton-line [width.px]="89"></pupa-skeleton-line>
      </pupa-skeleton-group>

      <pupa-skeleton-group>
        <pupa-skeleton-line [width.px]="12"></pupa-skeleton-line>
        <pupa-skeleton-line [width.px]="124"></pupa-skeleton-line>
      </pupa-skeleton-group>
    </pupa-skeleton>
  </div>
  `
}));
