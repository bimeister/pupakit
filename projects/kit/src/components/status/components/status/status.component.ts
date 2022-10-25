import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { StatusColor } from '../../../../declarations/types/status-color.type';
import { StatusKind } from '../../../../declarations/types/status-kind.type';

@Component({
  selector: 'pupa-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusComponent {
  @Input() public color: StatusColor = 'primary';
  @Input() public kind: StatusKind = 'line';
  @Input() public disabled: boolean = false;

  public get colorClass(): string {
    return `status_${this.color}`;
  }

  public get kindClass(): string {
    return `status__marker_${this.kind}`;
  }
}
