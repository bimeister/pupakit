import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  OnChanges,
  ViewEncapsulation
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isNil } from '@bimeister/utilities';
import { DrawerTitleComponent } from '../drawer-title/drawer-title.component';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';

type Types = 'top' | 'middle' | 'bottom';

const DEFAULT_TYPE: Types = 'middle';

@Component({
  selector: 'pupa-drawer-layout-header-row',
  templateUrl: './drawer-layout-header-row.component.html',
  styleUrls: ['./drawer-layout-header-row.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerLayoutHeaderRowComponent implements OnChanges, AfterContentInit {
  @ContentChild(DrawerTitleComponent) public titleComponent: DrawerTitleComponent;
  public readonly isDrawerTitleContains$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public type: Types;
  public readonly type$: BehaviorSubject<Types> = new BehaviorSubject<Types>(DEFAULT_TYPE);

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processTypeChanged(changes?.type);
  }

  public ngAfterContentInit(): void {
    this.isDrawerTitleContains$.next(!isNil(this.titleComponent));
  }

  public processTypeChanged(change: ComponentChange<this, Types>): void {
    if (isNil(change?.currentValue)) {
      return;
    }

    this.type$.next(change.currentValue);
  }
}
