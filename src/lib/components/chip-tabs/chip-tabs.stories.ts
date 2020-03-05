import { storiesOf } from '@storybook/angular';

import { ChipTabsModule } from './chip-tabs.module';

storiesOf('Chips', module).add('Chips Tabs', () => ({
  moduleMetadata: {
    imports: [ChipTabsModule]
  },
  template: `
    <pupa-chip-tabs>
      <pupa-chip-tabs-item>
        🦁
      </pupa-chip-tabs-item>
      <pupa-chip-tabs-item>
        🐷
      </pupa-chip-tabs-item>
      <pupa-chip-tabs-item>
        🦜
      </pupa-chip-tabs-item>
      <pupa-chip-tabs-item>
        🐴
      </pupa-chip-tabs-item>
      <pupa-chip-tabs-item>
        🐶
      </pupa-chip-tabs-item>
    </pupa-chip-tabs>
  `
}));
