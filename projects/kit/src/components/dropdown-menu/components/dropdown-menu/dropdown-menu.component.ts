import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { createProviderIfMissing } from '@bimeister/pupakit.common';
import { DropdownRef } from '../../../../declarations/classes/dropdown-ref.class';
import { DropdownMenuContextService } from '../../services/dropdown-menu-context.service';

@Component({
  selector: 'pupa-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [createProviderIfMissing(DropdownMenuContextService, [])],
})
export class DropdownMenuComponent implements OnChanges {
  @Input() public dropdownRef?: DropdownRef;

  constructor(private readonly contextService: DropdownMenuContextService) {}

  public ngOnChanges(): void {
    this.contextService.setDropdownRef(this.dropdownRef ?? null);
  }
}
