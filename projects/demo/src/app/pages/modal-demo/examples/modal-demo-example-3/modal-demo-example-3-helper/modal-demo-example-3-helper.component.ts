import { ChangeDetectionStrategy, Component, Injector, ViewEncapsulation } from '@angular/core';
import { ModalsService, OpenedModal } from '@bimeister/pupakit.overlays';
import { Observable } from 'rxjs';
import { ModalDemoExample3Component } from '../modal-content/modal-demo-example-3.component';

@Component({
  selector: 'pupa-modal-demo-example-3-helper',
  templateUrl: './modal-demo-example-3-helper.component.html',
  styleUrls: ['./modal-demo-example-3-helper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ModalDemoExample3HelperComponent {
  public modalCloseMessage$: Observable<string>;

  constructor(private readonly modalsService: ModalsService, private readonly injector: Injector) {}

  public openModal(): void {
    const modal: OpenedModal<string> = this.modalsService.open(ModalDemoExample3Component, {
      injector: this.injector,
      closeOnBackdropClick: false,
      isBackdropTransparent: true,
    });

    this.modalCloseMessage$ = modal.closed$;
  }
}
