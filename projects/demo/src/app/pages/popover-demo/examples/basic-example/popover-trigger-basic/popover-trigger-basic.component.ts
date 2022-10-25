import { ChangeDetectionStrategy, Component, ElementRef, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { PopoversService, ToastsService } from '@bimeister/pupakit.overlays';
import { PopoverLayoutBasicComponent } from '../popover-layout-basic/popover-layout-basic.component';

@Component({
  selector: 'demo-popover-trigger-basic',
  templateUrl: './popover-trigger-basic.component.html',
  styleUrls: ['./popover-trigger-basic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PopoverTriggerBasicComponent {
  @ViewChild('popoverAnchor') public readonly popoverAnchorRef: ElementRef<HTMLElement>;

  constructor(
    private readonly popoversService: PopoversService,
    private readonly toastsService: ToastsService,
    private readonly injector: Injector
  ) {}

  public openPopover(): void {
    this.popoversService.open({
      component: PopoverLayoutBasicComponent,
      anchor: this.popoverAnchorRef,
      data: {
        title: 'Title',
        buttonAction: () => this.toastsService.open({ data: { bodyText: 'Hello there!', type: 'info' } }),
      },
      injector: this.injector,
      hasBackdrop: false,
    });
  }
}
