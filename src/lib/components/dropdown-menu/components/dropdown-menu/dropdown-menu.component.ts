import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { DropdownService } from '../../services/dropdown.service';

@Component({
  selector: 'pupa-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DropdownService]
})
export class DropdownMenuComponent {
  public readonly isOpened$: Observable<boolean> = this.dropdownService.isOpened$;

  constructor(private readonly dropdownService: DropdownService) {}

  public setOpened(isOpened: boolean): void {
    this.dropdownService.setOpened(isOpened);
  }
}
