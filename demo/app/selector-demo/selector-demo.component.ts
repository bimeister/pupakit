import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'demo-select',
  styleUrls: ['../demo.scss', './selector-demo.component.scss'],
  templateUrl: './selector-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectorDemoComponent {
  public readonly sampleFormControl: FormControl = new FormControl('default value', Validators.required);
  public readonly daysOfWeek: string[] = ['Пн', 'Вт', 'Среда', 'Воскресенье', 'a', 'b'];

  constructor() {
    this.sampleFormControl.valueChanges.subscribe(v => {
      // tslint:disable-next-line: no-console
      console.log('sd', v);
      // tslint:disable-next-line: no-console
      console.log('sd errs', this.sampleFormControl.errors);
    });
  }

  public writeTestValue(): void {
    this.sampleFormControl.setValue([0, 1, 3]);
  }
  public selectRandom(): void {
    const toSelect: number[] = [];

    const rndInt = (max: number) => Math.floor(Math.random() * max);

    for (let i: number = 0; i < 10; i++) {
      toSelect.push(rndInt(10));
    }

    // tslint:disable-next-line: no-console
    console.log(toSelect);
    this.sampleFormControl.setValue(toSelect);
  }

  public disableForm(): void {
    this.sampleFormControl.enabled ? this.sampleFormControl.disable() : this.sampleFormControl.enable();
  }

  public clearAll(): void {
    this.sampleFormControl.setValue([]);
  }

  public validate(): void {
    // tslint:disable-next-line: no-console
    console.log('sd validate', this.sampleFormControl.errors);
  }
}
