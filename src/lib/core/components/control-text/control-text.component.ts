import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pupa-control-text',
  templateUrl: './control-text.component.html',
  styleUrls: ['./control-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlTextComponent {
  @Input() public isError: boolean = false;
}
