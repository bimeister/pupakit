import { ChangeDetectionStrategy, Component, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DropdownMenuContextService } from '../../services/dropdown-menu-context.service';

@Component({
  selector: 'pupa-dropdown-menu-item',
  templateUrl: './dropdown-menu-item.component.html',
  styleUrls: ['./dropdown-menu-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuItemComponent {
  @Input() public active: boolean = false;
  @Input() public disabled: boolean = false;
  @Input() public autoClose: boolean = true;

  public readonly isOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private readonly contextService: DropdownMenuContextService) {}

  @HostListener('click')
  public clicked(): void {
    if (this.autoClose) {
      this.contextService.closeDropdown();
    }
  }
}
