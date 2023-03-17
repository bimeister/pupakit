import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { Theme } from '@bimeister/pupakit.common';
import { DROPDOWN_CONTAINER_DATA_TOKEN } from '../../../../declarations/tokens/dropdown-container-data.token';
import { DropdownContainerData } from '../../../../declarations/interfaces/dropdown-container-data.interface';

@Component({
  selector: 'pupa-dropdown-container',
  templateUrl: './dropdown-container.component.html',
  styleUrls: ['./dropdown-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('dropdownShow', [
      transition('void => *', [
        animate(
          '400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          keyframes([
            style({ transform: 'translateY(10px)', opacity: 0 }),
            style({ transform: 'translateY(0px)', opacity: 1 }),
          ])
        ),
      ]),
    ]),
  ],
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
