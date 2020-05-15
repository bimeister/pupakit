import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { storiesOf } from '@storybook/angular';

import { RadioGroupModule } from './radio-group.module';

const formControl: FormControl = new FormControl();
storiesOf('Controls', module).add('Radio group', () => ({
  moduleMetadata: {
    imports: [RadioGroupModule, ReactiveFormsModule]
  },
  template: `

  <pupa-radio-group [formControl]="formControl">
    <pupa-radio-control value="1">
      <pupa-radio-control-marker></pupa-radio-control-marker>
      <pupa-radio-control-label>
        Label
      </pupa-radio-control-label>
    </pupa-radio-control>
  </pupa-radio-group>

  `,
  props: {
    formControl
  }
}));
