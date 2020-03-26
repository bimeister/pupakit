import { storiesOf } from '@storybook/angular';

import { TooltipModule } from './tooltip.module';

storiesOf('Tooltip', module).add('default', () => ({
  moduleMetadata: {
    imports: [TooltipModule]
  },
  template: `
    <pupa-tooltip [closeOnContentClick]="false">
      <pupa-tooltip-trigger style="background-color: aqua;">
        🎈
      </pupa-tooltip-trigger>
      <pupa-tooltip-content>
        This is Tooltip Content 🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈
      </pupa-tooltip-content>
    </pupa-tooltip>
  `
}));
