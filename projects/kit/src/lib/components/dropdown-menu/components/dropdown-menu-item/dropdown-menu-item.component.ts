import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
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

  @Output() public readonly select: EventEmitter<void> = new EventEmitter<void>();

  public readonly isOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private readonly contextService: DropdownMenuContextService) {}

  @HostListener('click')
  public clicked(): void {
    if (this.disabled) {
      return;
    }
    this.selectAndClose();
  }

  @HostListener('keydown', ['$event'])
  public keydown(event: KeyboardEvent): void {
    if (this.disabled || event.key !== 'Enter') {
      return;
    }
    this.selectAndClose();
  }

  private selectAndClose(): void {
    this.select.emit();
    if (this.autoClose) {
      this.contextService.closeDropdown();
    }
  }
}
