import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-label',
  styleUrls: ['label-demo.component.scss'],
  templateUrl: './label-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelDemoComponent {
  public readonly formControl: FormControl = new FormControl('Label Text');
}
