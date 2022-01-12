import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-label',
  styleUrls: ['label-demo.component.scss'],
  templateUrl: './label-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelDemoComponent {
  public readonly buttonIconFormControl: FormControl = new FormControl('app-info');

  public readonly textFormControl: FormControl = new FormControl('Label Text');
}
