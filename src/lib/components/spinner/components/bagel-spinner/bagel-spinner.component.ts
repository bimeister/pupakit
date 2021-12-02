import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-bagel-spinner',
  templateUrl: './bagel-spinner.component.html',
  styleUrls: ['./bagel-spinner.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BagelSpinnerComponent {
  @Input() public size: string = 'inherit';
}
