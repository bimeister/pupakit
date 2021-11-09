import { ChangeDetectionStrategy, Component, HostListener, Inject, Input, ViewEncapsulation } from '@angular/core';
import { Nullable } from '@bimeister/utilities';
import { DrawerRef } from '../../../../../internal/declarations/classes/drawer-ref.class';

@Component({
  selector: 'pupa-drawer-layout-action',
  templateUrl: './drawer-layout-action.component.html',
  styleUrls: ['./drawer-layout-action.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerLayoutActionComponent<ValueT> {
  @Input() public value: Nullable<ValueT> = null;

  constructor(@Inject(DrawerRef) private readonly drawerRef: DrawerRef<ValueT>) {}

  @HostListener('click')
  public processActionClick(): void {
    this.drawerRef.close(this.value);
  }
}
