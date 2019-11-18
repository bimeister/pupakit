import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'demo-button',
  styleUrls: ['../demo.scss', './radio-button-demo.component.scss'],
  templateUrl: './radio-button-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioButtonDemoComponent {
  public form: FormGroup = new FormGroup({
    name: new FormControl('Alice')
  });
}
