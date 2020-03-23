import { storiesOf } from '@storybook/angular';

import { TreeModule } from './tree.module';

storiesOf('Tree', module).add('default', () => ({
  moduleMetadata: {
    imports: [TreeModule]
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
