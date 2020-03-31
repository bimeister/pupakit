import { storiesOf } from '@storybook/angular';

import { ExpansibleModule } from './expansible.module';

storiesOf('Behavior', module).add('Expansible', () => ({
  moduleMetadata: {
    imports: [ExpansibleModule]
  },
  template: `
<style>
  pupa-expansible {
    position: fixed;
    display: block;
  }

  pupa-expander {
    display: block;
    user-select: none;
  }

  .container {
    width: 100vw;
    height: 100vh;
  }

  .placeholder {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: cyan;
    position: absolute;
    z-index: -1;
  }
</style>
<div class="container" style="display: flex; flex-direction: row; align-items: center; justify-content: center; width: 100vw; height: 100vh;">
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
</div>
  `
}));
