import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { StatusColor } from '../../../../../internal/declarations/types/status-color.type';

@Component({
  selector: 'pupa-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusComponent {
  @Input() public color: StatusColor = 'primary';
  @Input() public disabled: boolean = false;

  public get colorClass(): string {
    return `status_${this.color}`;
  }
}
