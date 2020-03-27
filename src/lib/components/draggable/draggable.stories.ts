import { storiesOf } from '@storybook/angular';

import { DraggableModule } from './draggable.module';

storiesOf('Behavior', module).add('Draggable', () => ({
  moduleMetadata: {
    imports: [DraggableModule]
  },
  template: `
  <style>
    pupa-draggable {
      position: fixed;
      display: block;
    }

    pupa-dragger {
      display: block;
      user-select: none;
      cursor: move;
    }
  </style>

  <pupa-draggable>
    <pupa-dragger title="dragger">
      🚚
    </pupa-dragger>

    <div class="block">
      [draggable content]
    </div>
  </pupa-draggable>

  `
}));
