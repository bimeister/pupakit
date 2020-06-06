import { storiesOf } from '@storybook/angular';

import { ExpansibleModule } from './expansible.module';

storiesOf('Behavior', module).add('Expansible', () => ({
  moduleMetadata: {
    imports: [ExpansibleModule]
  },
  template: `
<style>
  .placeholder {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-width: 100px;
    min-height: 100px;
    background: cyan;
    position: absolute;
    z-index: -1;
  }
</style>
  <pupa-expansible [width.px]="400" [height.px]="300">
    <pupa-expander [behavior]="'top'">
      ⬆
    </pupa-expander>
    <pupa-expander [behavior]="'vertical'">
      ↕
    </pupa-expander>
    <pupa-expander [behavior]="'bottom'">
      ⬇
    </pupa-expander>
    <pupa-expander [behavior]="'right'">
      ➡
    </pupa-expander>
    <pupa-expander [behavior]="'horizontal'">
      ↔
    </pupa-expander>
    <pupa-expander [behavior]="'left'">
      ⬅
    </pupa-expander>
    <pupa-expander [behavior]="'left-top'">
      ↖
    </pupa-expander>
    <pupa-expander [behavior]="'right-top'">
      ↗
    </pupa-expander>
    <pupa-expander [behavior]="'left-bottom'">
      ↙
    </pupa-expander>
    <pupa-expander [behavior]="'right-bottom'">
      ↘
    </pupa-expander>

    <div style="width: 100%; height: 100%; background: cyan;"></div>
  </pupa-expansible>
  `
}));
