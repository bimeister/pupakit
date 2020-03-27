import { Component, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'pupa-dropdown-menu-trigger',
  templateUrl: './dropdown-menu-trigger.component.html',
  styleUrls: ['./dropdown-menu-trigger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownMenuTriggerComponent {
  public readonly onClick$: Subject<DropdownMenuTriggerComponent> = new Subject<DropdownMenuTriggerComponent>();

  @HostListener('click')
  public clicked(): void {
    this.onClick$.next(this);
  }
}
