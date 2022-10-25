import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-control-text',
  templateUrl: './control-text.component.html',
  styleUrls: ['./control-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ControlTextComponent {
  @Input() public isError: boolean = false;
}
