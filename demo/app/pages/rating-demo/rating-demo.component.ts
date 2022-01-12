import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'demo-loader',
  styleUrls: ['./rating-demo.component.scss'],
  templateUrl: './rating-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingDemoComponent {
  public readonly valueFormControl: FormControl = new FormControl(3);
  public readonly value$: Observable<number> = this.valueFormControl.valueChanges.pipe(startWith());

  public readonly numberOfStarsFormControl: FormControl = new FormControl(5);

  public readonly starSizeOptions: PropsOption[] = [
    {
      caption: 'large',
      value: 'large',
      isDefault: true,
    },
    {
      caption: 'medium',
      value: 'medium',
    },
    {
      caption: 'small',
      value: 'small',
    },
  ];

  public handleValueChange(value: number): void {
    this.valueFormControl.setValue(value);
  }
}
