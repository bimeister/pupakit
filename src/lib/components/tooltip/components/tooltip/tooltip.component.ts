import { Component, Input, ChangeDetectionStrategy, OnChanges, HostListener } from '@angular/core';
import { TooltipService } from '../../services/tooltip.service';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { isNil } from '@bimeister/utilities';
import { Observable } from 'rxjs';

@Component({
  selector: 'pupa-tooltip',
  templateUrl: './tooltip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TooltipService]
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

  @HostListener('window:wheel')
  public processScroll(): void {
    this.close();
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
