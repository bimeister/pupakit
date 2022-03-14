import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { DrawerRef } from '../../../../../internal/declarations/classes/drawer-ref.class';
import { Observable } from 'rxjs';

@Component({
  selector: 'pupa-drawer-expand-button',
  templateUrl: './drawer-expand-button.component.html',
  styleUrls: ['./drawer-expand-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerExpandButtonComponent {
  public icon$: Observable<string> = this.drawerRef.isFullscreen$.pipe(
    map((isFullscreen: boolean) => (isFullscreen ? 'app-fit-to-page' : 'app-resize'))
  );

  constructor(@Inject(DrawerRef) private readonly drawerRef: DrawerRef) {}

  public handleClick(): void {
    this.drawerRef.isFullscreen$
      .pipe(take(1))
      .subscribe((isFullscreen: boolean) => this.drawerRef.changeFullscreenMode(!isFullscreen));
  }
}
