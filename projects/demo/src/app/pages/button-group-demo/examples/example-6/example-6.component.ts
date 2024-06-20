import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ModalsService, OpenedModal } from '@bimeister/pupakit.overlays';
import { ModalDemoExample6Component } from '../../../modal-demo/examples/modal-demo-example-6/modal-content/modal-demo-example-6.component';
import { isNil } from '@bimeister/utilities';

@Component({
  selector: 'demo-button-group-example-6',
  templateUrl: './example-6.component.html',
  styleUrls: ['./example-6.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupExample6Component {
  constructor(private readonly modalsService: ModalsService) {}

  public processButtonGroupItemClickEvent(clickEventCallback: VoidFunction): void {
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
