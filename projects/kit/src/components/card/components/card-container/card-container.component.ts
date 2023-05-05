import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { Nullable } from '@bimeister/utilities';

@Component({
  selector: 'pupa-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardContainerComponent {
  @Input() public disabled: boolean = false;
  @Input() public clickable: boolean = false;
  @Input() public selected: boolean = false;

  @Input() public tabIndex: number = 0;
  public get tabIndexAttribute(): Nullable<number> {
    return this.clickable ? this.tabIndex : null;
  }
}
