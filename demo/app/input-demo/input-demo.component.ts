import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import combos from 'combos';
import { Subscription } from 'rxjs';

@Component({
  selector: 'demo-input',
  styleUrls: ['../demo.scss'],
  templateUrl: './input-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDemoComponent implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();
  public readonly sampleFormControl: FormControl = new FormControl('formControl', Validators.required);

  public readonly combos: any[] = combos({
    size: ['medium', 'small'],
    placeholder: ['placeholder'],
    disabled: [false, true],
    type: ['text', 'password', 'date', 'date-range'],
    showValidateIcon: [false, true],
    isFluid: [false, true]
  });

  constructor() {
    /* tslint:disable */
    this.subscription.add(this.sampleFormControl.valueChanges.subscribe(console.log));
    /* tslint:enable */
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
