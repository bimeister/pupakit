import { ChangeDetectionStrategy, Component, ElementRef, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { PopoversService } from '@bimeister/pupakit.overlays';
import { PopoverLayoutOtherComponent } from '../popover-layout-other/popover-layout-other.component';

@Component({
  selector: 'demo-popover-trigger-other',
  templateUrl: './popover-trigger-other.component.html',
  styleUrls: ['./popover-trigger-other.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PopoverTriggerOtherComponent {
  @ViewChild('popoverAnchor') public readonly popoverAnchorRef: ElementRef<HTMLElement>;

  constructor(private readonly popoversService: PopoversService, private readonly injector: Injector) {}

  public openPopover(): void {
    this.popoversService.open({
      component: PopoverLayoutOtherComponent,
      anchor: this.popoverAnchorRef,
      data: {},
      injector: this.injector,
      hasBackdrop: false,
    });
  }
}
