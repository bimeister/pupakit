import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RadioOption } from '../../shared/components/example-viewer/radio-option';

@Component({
  selector: 'demo-controls-is-patched-demo',
  templateUrl: './controls-is-patched-demo.component.html',
  styleUrls: ['./controls-is-patched-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsIsPatchedDemoComponent {
  public readonly formControl: FormControl = new FormControl(null, Validators.required);
  public readonly controlRange: FormControl = new FormControl([], Validators.required);

  public readonly typeOptions: RadioOption[] = [
    {
      caption: 'Inputs',
      value: 'inputs',
    },
    {
      caption: 'Selects',
      value: 'selects',
    },
  ];
}
