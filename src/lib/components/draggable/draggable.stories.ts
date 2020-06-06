import { storiesOf } from '@storybook/angular';

import { DraggableModule } from './draggable.module';

storiesOf('Behavior', module).add('Draggable', () => ({
  moduleMetadata: {
    imports: [DraggableModule]
  },
  template: `

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
