import { ChangeDetectionStrategy, Component, Injector, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Position } from '@bimeister/pupakit.common';
import { PopoversService } from '@bimeister/pupakit.overlays';
import { PopoverLayoutCoordinatesComponent } from '../popover-layout-coordinates/popover-layout-coordinates.component';

@Component({
  selector: 'demo-popover-trigger-coordinates',
  templateUrl: './popover-trigger-coordinates.component.html',
  styleUrls: ['./popover-trigger-coordinates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PopoverTriggerCoordinatesComponent {
  public readonly xPos: FormControl = new FormControl(100);
  public readonly yPos: FormControl = new FormControl(100);

  constructor(private readonly popoversService: PopoversService, private readonly injector: Injector) {}

  public openPopover(): void {
    const coordinates: Position = [Number(this.xPos.value), Number(this.yPos.value)];

    this.popoversService.open({
      component: PopoverLayoutCoordinatesComponent,
      anchor: coordinates,
      data: { fruits: ['🍇', '🍉', '🍑'] },
      injector: this.injector,
      hasBackdrop: false,
    });
  }
}
