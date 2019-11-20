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
  private valueData: string;
  public set value(v: string) {
    /* tslint:disable */
    // console.log('value change', v);
    /* tslint:enable */
    this.valueData = v;
  }
  public get value(): string {
    return this.valueData;
  }

  constructor() {
    /* tslint:disable */
    // this.form.valueChanges.subscribe(formValue => console.log(formValue));
    /* tslint:enable */
  }
}
