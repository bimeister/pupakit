import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { DropdownComponentBase } from '@bimeister/pupakit.kit';

@Component({
  selector: 'pupa-dropdown-demo-container',
  templateUrl: './dropdown-demo-container.component.html',
  styleUrls: ['./dropdown-demo-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownDemoContainerComponent extends DropdownComponentBase<void> {
  public close(): void {
    this.dropdownRef.close();
  }
}
