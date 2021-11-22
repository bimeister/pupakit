import { ChangeDetectionStrategy, Component, Inject, Input, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { isNil } from '@bimeister/utilities';
import { DrawerRef } from '../../../../../internal/declarations/classes/drawer-ref.class';

const DEFAULT_ICON: string = 'app-cross';

type VisibleOn = 'desktop' | 'mobile' | 'all';

const DEFAULT_VISIBLE_ON: VisibleOn = 'all';

@Component({
  selector: 'pupa-drawer-close-button-new',
  templateUrl: './drawer-close-button-new.component.html',
  styleUrls: ['./drawer-close-button-new.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerCloseButtonNewComponent {
  @Input() public icon: string = DEFAULT_ICON;
  public readonly icon$: BehaviorSubject<string> = new BehaviorSubject<string>(DEFAULT_ICON);

  @Input() public visibleOn: VisibleOn = DEFAULT_VISIBLE_ON;
  public readonly visibleOn$: BehaviorSubject<VisibleOn> = new BehaviorSubject<VisibleOn>(DEFAULT_VISIBLE_ON);

  constructor(@Inject(DrawerRef) private readonly drawerRef: DrawerRef<number>) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processIconChange(changes?.icon);
    this.processVisibleOnChange(changes?.visibleOn);
  }

  public handleClick(): void {
    this.drawerRef.close();
  }

  private processIconChange(change: ComponentChange<this, string>): void {
    const currentValue: string | undefined = change?.currentValue;

    if (isNil(currentValue)) {
      return;
    }

    this.icon$.next(currentValue);
  }

  private processVisibleOnChange(change: ComponentChange<this, VisibleOn>): void {
    const currentValue: VisibleOn | undefined = change?.currentValue;

    if (isNil(currentValue)) {
      return;
    }

    this.visibleOn$.next(currentValue);
  }
}
