import { Component, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'pupa-dropdown-menu-item',
  templateUrl: './dropdown-menu-item.component.html',
  styleUrls: ['./dropdown-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownMenuItemComponent {
  public readonly onClick$: Subject<DropdownMenuItemComponent> = new Subject<DropdownMenuItemComponent>();

  @HostListener('click')
  public clicked(): void {
    this.onClick$.next(this);
  }
}
