import { ChangeDetectionStrategy, Component, Host, HostListener, Input } from '@angular/core';

import { MultiselectionListComponent } from '../multiselection-list/multiselection-list.component';

@Component({
  selector: 'pupa-multiselection-list-item',
  templateUrl: './multiselection-list-item.component.html',
  styleUrls: ['./multiselection-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiselectionListItemComponent {
  @Input() public value: string;

  constructor(@Host() private readonly multiselectionList: MultiselectionListComponent) {}

  @HostListener('click')
  public clickHandler(): void {
    this.multiselectionList.toggleValue(this.value);
  }
}
