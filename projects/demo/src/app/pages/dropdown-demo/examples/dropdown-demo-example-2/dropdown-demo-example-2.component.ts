import { ChangeDetectionStrategy, Component, Injector, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Position } from '@bimeister/pupakit.common';
import { DropdownsService } from '@bimeister/pupakit.kit';
import { DropdownDemoContainerComponent } from '../dropdown-demo-container/dropdown-demo-container.component';

@Component({
  selector: 'demo-dropdown-example-2',
  templateUrl: './dropdown-demo-example-2.component.html',
  styleUrls: ['./dropdown-demo-example-2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownDemoExample2Component {
  public readonly xPos: FormControl<number> = new FormControl<number>(100);
  public readonly yPos: FormControl<number> = new FormControl<number>(100);

  constructor(private readonly dropdownsService: DropdownsService, private readonly injector: Injector) {};

  public openDropdown(): void {
    const coordinates: Position = [Number(this.xPos.value), Number(this.yPos.value)];

    this.dropdownsService.open({
      target: coordinates,
      widthType: 'auto',
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      component: DropdownDemoContainerComponent,
      injector: this.injector,
    });
  }
}
