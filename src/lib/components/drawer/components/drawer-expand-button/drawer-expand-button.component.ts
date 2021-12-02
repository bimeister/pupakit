import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { take } from 'rxjs/operators';
import { DrawerRef } from '../../../../../internal/declarations/classes/drawer-ref.class';

@Component({
  selector: 'pupa-drawer-expand-button',
  templateUrl: './drawer-expand-button.component.html',
  styleUrls: ['./drawer-expand-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerExpandButtonComponent {
  constructor(@Inject(DrawerRef) private readonly drawerRef: DrawerRef) {}

  public handleClick(): void {
    this.drawerRef.isFullscreen$
      .pipe(take(1))
      .subscribe((isFullscreen: boolean) => this.drawerRef.changeFullscreenMode(!isFullscreen));
  }
}
