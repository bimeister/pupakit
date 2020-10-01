import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'demo-table-input-demo',
  styleUrls: ['../demo.scss', 'table-input-demo.component.scss'],
  templateUrl: './table-input-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableInputDemoComponent {
  public readonly switcherThemeControl: FormControl = new FormControl(false);

  public readonly emptyTableInputControl: FormControl = new FormControl();
  public readonly valueTableInputControl: FormControl = new FormControl('33 кВт');

  public readonly disabledEmptyTableInputControl: FormControl = new FormControl({ value: '', disabled: true });
  public readonly disabledValueTableInputControl: FormControl = new FormControl({ value: '33 кВт', disabled: true });

  public readonly validatorTableInputControl: FormControl = new FormControl('1', [Validators.maxLength(2)]);
  public readonly validator2TableInputControl: FormControl = new FormControl('1', [Validators.maxLength(2)]);
}
