import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';

type LocatedIn = 'body' | 'layout' | 'header';

const DEFAULT_TYPE: LocatedIn = 'layout';

@Component({
  selector: 'pupa-drawer-layout-separator-new',
  templateUrl: './drawer-layout-separator-new.component.html',
  styleUrls: ['./drawer-layout-separator-new.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerLayoutSeparatorNewComponent {
  @Input()
  public set locatedIn(value: LocatedIn) {
    const currentValue: LocatedIn | undefined = value;

    if (isNil(currentValue)) {
      return;
    }

    this.locatedIn$.next(currentValue);
  }

  public readonly locatedIn$: BehaviorSubject<LocatedIn> = new BehaviorSubject<LocatedIn>(DEFAULT_TYPE);
}
