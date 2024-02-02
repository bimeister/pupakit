import { ChangeDetectionStrategy, Component, ElementRef, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { PopoversService } from '@bimeister/pupakit.overlays';
import { PopoverLayoutComponent } from './popover-layout-basic/popover-layout.component';

const ITEM_COUNT: number = 25;

@Component({
  selector: 'demo-actions-example-5',
  templateUrl: './example-5.component.html',
  styleUrls: ['./example-5.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsExample5Component {
  @ViewChild('popoverAnchor') public readonly popoverAnchorRef: ElementRef<HTMLElement>;
  public readonly actions: string[] = [];

  constructor(private readonly popoversService: PopoversService, private readonly injector: Injector) {
    for (let i: number = 1; i < ITEM_COUNT; i++) {
      this.actions.push(`Button ${i}`);
    }
  }

  public openPopover(overflowedActions: string[], event: Event): void {
    this.popoversService.open({
      component: PopoverLayoutComponent,
      anchor: this.popoverAnchorRef,
      trigger: {
        element: event.target,
      },
      data: overflowedActions,
      injector: this.injector,
      hasBackdrop: false,
    });
  }
}
