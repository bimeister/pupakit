import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'demo-switcher-example-1',
  templateUrl: './example-1.component.html',
  styleUrls: ['./example-1.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitcherExample1Component {
  public readonly simpleControl: FormControl = new FormControl(true);

  public readonly disabledDefaultControl: FormControl = new FormControl({ value: false, disabled: true });
  public readonly disabledActiveControl: FormControl = new FormControl({ value: true, disabled: true });

  public readonly value$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public handleUpdateValue(updatedValue: boolean): void {
    this.value$.next(updatedValue);
  }
}
