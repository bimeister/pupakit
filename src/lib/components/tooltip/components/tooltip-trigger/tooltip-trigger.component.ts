import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Host,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { filterFalsy, isNil, Nullable } from '@bimeister/utilities';
import { filter, take } from 'rxjs/operators';
import { EventUnlistener } from '../../../../../internal/declarations/types/event-unlistener.type';
import { isTabletDevice } from '../../../../../internal/helpers/is-tablet-device.helper';
import { TooltipService } from '../../services/tooltip.service';

@Component({
  selector: 'pupa-tooltip-trigger',
  templateUrl: './tooltip-trigger.component.html',
  styleUrls: ['./tooltip-trigger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class TooltipTriggerComponent implements OnInit {
  @ViewChild('overlayOrigin', { static: true }) protected readonly overlayOrigin: CdkOverlayOrigin;
  private mouseLeaveEventUnlistener: Nullable<EventUnlistener> = null;

  constructor(
    private readonly tooltipService: TooltipService,
    private readonly renderer: Renderer2,
    @Host() private readonly hostElementRef: ElementRef<HTMLElement>
  ) {}

  public ngOnInit(): void {
    this.registerDropdownTrigger();
    this.unlistenMouseLeaveEvent();
  }

  @HostListener('mouseenter')
  public processMouseEnter(): void {
    this.tooltipService.isDisabled$
      .pipe(
        take(1),
        filterFalsy(),
        filter(() => !isTabletDevice())
      )
      .subscribe(() => {
        this.tooltipService.processTriggerMouseEnter();
        this.listenMouseLeaveEvent();
      });
  }

  private registerDropdownTrigger(): void {
    this.tooltipService.registerTooltipOverlayOrigin(this.overlayOrigin);
  }

  private listenMouseLeaveEvent(): void {
    this.mouseLeaveEventUnlistener = this.renderer.listen(this.hostElementRef.nativeElement, 'mouseleave', () => {
      this.tooltipService.processTriggerMouseLeave();
      this.unlistenMouseLeaveEvent();
    });
  }

  private unlistenMouseLeaveEvent(): void {
    if (isNil(this.mouseLeaveEventUnlistener)) {
      return;
    }
    this.mouseLeaveEventUnlistener();
  }
}
