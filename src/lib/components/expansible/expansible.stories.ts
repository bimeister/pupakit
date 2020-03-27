import { storiesOf } from '@storybook/angular';

import { ExpansibleModule } from './expansible.module';

storiesOf('Behavior', module).add('Expansible', () => ({
  moduleMetadata: {
    imports: [ExpansibleModule]
  },
  template: `
123

  `
}));
