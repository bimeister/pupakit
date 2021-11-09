import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { isNil } from '@bimeister/utilities';

type Types = 'right' | 'left';

const DEFAULT_TYPE: Types = 'right';

@Component({
  selector: 'pupa-drawer-layout-header-content',
  templateUrl: './drawer-layout-header-content.component.html',
  styleUrls: ['./drawer-layout-header-content.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerLayoutHeaderContentComponent {
  @Input()
  public set type(value: Types) {
    if (isNil(value)) {
      return;
    }

    this.hostClass = value;
  }

  @HostBinding('class') public hostClass: string = DEFAULT_TYPE;
}
