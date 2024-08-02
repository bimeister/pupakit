import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-radio-button-example-4',
  templateUrl: './example-4.component.html',
  styleUrls: ['./example-4.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonExample4Component implements OnInit {
  public readonly disabledGroupControl: FormControl<number> = new FormControl<number>(1, { nonNullable: true });

  public readonly disabledOptionControl: FormControl<number> = new FormControl<number>(2, { nonNullable: true });

  public ngOnInit(): void {
    this.disabledGroupControl.disable();
  }
}
