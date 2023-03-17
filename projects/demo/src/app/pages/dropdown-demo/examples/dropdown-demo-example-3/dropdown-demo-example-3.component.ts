import { ChangeDetectionStrategy, Component, Injector, ViewEncapsulation } from '@angular/core';
import { DropdownsService } from '@bimeister/pupakit.kit';
import { DropdownDemoContainerComponent } from '../dropdown-demo-container/dropdown-demo-container.component';

@Component({
  selector: 'demo-dropdown-example-3',
  templateUrl: './dropdown-demo-example-3.component.html',
  styleUrls: ['./dropdown-demo-example-3.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownDemoExample3Component {
  constructor(private readonly popoversService: DropdownsService, private readonly injector: Injector) {}

  public openContextMenu(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    this.popoversService.open({
      target: [event.clientX, event.clientY],
      widthType: 'auto',
      horizontalPosition: 'center',
      component: DropdownDemoContainerComponent,
      injector: this.injector,
    });
  }
}
