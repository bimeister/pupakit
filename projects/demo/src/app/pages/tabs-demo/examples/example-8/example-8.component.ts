import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ModalsService, OpenedModal } from '@bimeister/pupakit.overlays';
import { ModalDemoExample6Component } from '../../../modal-demo/examples/modal-demo-example-6/modal-content/modal-demo-example-6.component';
import { isNil } from '@bimeister/utilities';

@Component({
  selector: 'demo-tabs-example-8',
  templateUrl: './example-8.component.html',
  styleUrls: ['./example-8.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsExample8Component {
  constructor(private readonly modalsService: ModalsService) {}

  public processTabsItemClickEvent(clickEventCallback: VoidFunction): void {
    const modal: OpenedModal<string> = this.modalsService.open(ModalDemoExample6Component, {
      hasBackdrop: true,
      closeOnBackdropClick: true,
      isBackdropTransparent: false,
      hasBorder: true,
    });

    modal.closed$.subscribe((result: string | null) => {
      if (!isNil(result)) {
        clickEventCallback();
      }
    });
  }
}
