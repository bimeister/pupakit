import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-required-field-example-1',
  styleUrls: ['./example-1.component.scss'],
  templateUrl: './example-1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class RequiredFieldExample1Component {}
