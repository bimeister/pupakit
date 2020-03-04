import { storiesOf } from '@storybook/angular';

import { VerticalTabsModule } from './vertical-tabs.module';

storiesOf('Vertical Tabs', module).add('default', () => ({
  moduleMetadata: {
    imports: [VerticalTabsModule]
  },
  template: `
    <pupa-vertical-tabs>
      <pupa-vertical-tabs-item>
        🍕🍕🍕
      </pupa-vertical-tabs-item>
      <pupa-vertical-tabs-item>
        🍔🍔🍔
      </pupa-vertical-tabs-item>
      <pupa-vertical-tabs-item>
        🌭🌭🌭
      </pupa-vertical-tabs-item>
      <pupa-vertical-tabs-item>
        🍟🍟🍟
      </pupa-vertical-tabs-item>
      <pupa-vertical-tabs-item>
        🍖🍖🍖
      </pupa-vertical-tabs-item>
      <pupa-vertical-tabs-item>
        🍦🍦🍦
      </pupa-vertical-tabs-item>
      <pupa-vertical-tabs-item>
        🥗🥗🥗
      </pupa-vertical-tabs-item>
      <pupa-vertical-tabs-item>
        🥪🥪🥪
      </pupa-vertical-tabs-item>
      <pupa-vertical-tabs-item>
        🍜🍜🍜
      </pupa-vertical-tabs-item>
      <pupa-vertical-tabs-item>
        🍩🍩🍩
      </pupa-vertical-tabs-item>
      <pupa-vertical-tabs-item>
        🧁🧁🧁
      </pupa-vertical-tabs-item>
      <pupa-vertical-tabs-item>
        🧇🧇🧇
      </pupa-vertical-tabs-item>
    </pupa-vertical-tabs>
  `
}));
