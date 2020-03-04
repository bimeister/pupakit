import { storiesOf } from '@storybook/angular';

import { VerticalTabsItemComponent } from './components/vertical-tabs-item/vertical-tabs-item.component';
import { VerticalTabsComponent } from './components/vertical-tabs/vertical-tabs.component';

storiesOf('Vertical Tabs', module).add('default', () => ({
  moduleMetadata: {
    declarations: [VerticalTabsComponent, VerticalTabsItemComponent]
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
