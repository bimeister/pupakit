import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { DROPDOWN_CONTAINER_DATA_TOKEN } from '../../../../../internal/constants/tokens/dropdown-container-data.token';
import { Theme } from '../../../../../internal/declarations/enums/theme.enum';
import { DropdownContainerData } from '../../../../../internal/declarations/interfaces/dropdown-container-data.interface';

@Component({
  selector: 'pupa-dropdown-container',
  templateUrl: './dropdown-container.component.html',
  styleUrls: ['./dropdown-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownContainerComponent {
  public readonly componentPortal: ComponentPortal<DropdownContainerComponent> = this.componentData.componentPortal;
  public readonly theme: Theme = this.componentData.theme;

  constructor(
    @Inject(DROPDOWN_CONTAINER_DATA_TOKEN)
    private readonly componentData: DropdownContainerData<DropdownContainerComponent>
  ) {}

  public stopEvent(event: Event): void {
    event.stopPropagation();
  }
}
