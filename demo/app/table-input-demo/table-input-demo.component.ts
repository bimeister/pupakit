import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'demo-table-input-demo',
  styleUrls: ['table-input-demo.component.scss'],
  templateUrl: './table-input-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableInputDemoComponent {
  public readonly formControl: FormControl = new FormControl();
  public readonly validators: ValidatorFn[] = [Validators.maxLength(2)];
}
