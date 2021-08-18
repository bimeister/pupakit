import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { TooltipService } from '../../services/tooltip.service';

@Component({
  selector: 'pupa-tooltip',
  templateUrl: './tooltip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TooltipService],
  encapsulation: ViewEncapsulation.Emulated
})
export class TooltipComponent implements OnChanges {
  @Input() public hideOnTooltipHover: boolean = true;
  @Input() public disabled: boolean = false;

  public readonly isOpened$: Observable<boolean> = this.tooltipService.isOpened$;

  constructor(private readonly tooltipService: TooltipService) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processDisabledChanges(changes.disabled);
    this.processHideOnTooltipHoverChanges(changes.hideOnTooltipHover);
  }

  public open(): void {
    this.tooltipService.setOpenedState(true);
  }

  public close(): void {
    this.tooltipService.setOpenedState(false);
  }

  private processDisabledChanges(change: ComponentChange<this, boolean>): void {
    if (isNil(change)) {
      return;
    }
    this.tooltipService.setDisabledState(change.currentValue);
  }

  private processHideOnTooltipHoverChanges(change: ComponentChange<this, boolean>): void {
    if (isNil(change)) {
      return;
    }
    this.tooltipService.setHideOnTooltipHoverState(change.currentValue);
  }
}
