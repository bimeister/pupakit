import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pupa-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  @Input() public size: string = 'inherit';
}
