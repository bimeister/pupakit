import { ChangeDetectionStrategy, Component, Injector, ViewEncapsulation } from '@angular/core';
import { PopoverComponentBase } from '@kit/internal/declarations/classes/abstract/popover-component-base.abstract';
import { PopoverRef } from '@kit/internal/declarations/classes/popover-ref.class';
import { DrawersService } from '@kit/internal/shared/services/drawers.service';
import { DrawerContainerComponent } from '@kit/lib/components/drawer/components/drawer-container/drawer-container.component';
import { DRAWER_DATA_TOKEN } from '../../../../../../declarations/tokens/drawer-data.token';
import { DrawerLayoutOtherComponent } from '../drawer-layout-other/drawer-layout-other.component';

@Component({
  selector: 'demo-popover-layout-other',
  templateUrl: './popover-layout-other.component.html',
  styleUrls: ['./popover-layout-other.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PopoverLayoutOtherComponent extends PopoverComponentBase<{}, void> {
  constructor(
    public readonly popoverRef: PopoverRef<{}, void>,
    private readonly drawersService: DrawersService,
    private readonly injector: Injector
  ) {
    super(popoverRef);
  }

  public openDrawer(): void {
    this.drawersService.open(DrawerLayoutOtherComponent, {
      injector: this.injector,
      containerComponent: DrawerContainerComponent,
      providers: [
        {
          provide: DRAWER_DATA_TOKEN,
          useValue: [1, 2, 3, 4],
        },
      ],
    });
  }
}
