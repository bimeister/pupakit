import { ChangeDetectionStrategy, Component, Injector, ViewEncapsulation } from '@angular/core';
import { ModalsService, OpenedModal } from '@bimeister/pupakit.overlays';
import { Observable } from 'rxjs';
import { MODAL_DATA_TOKEN } from '../../../../../../declarations/tokens/modal-data.token';
import { ModalDemoExample2Component } from '../modal-content/modal-demo-example-2.component';

@Component({
  selector: 'pupa-modal-demo-example-2-helper',
  templateUrl: './modal-demo-example-2-helper.component.html',
  styleUrls: ['./modal-demo-example-2-helper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ModalDemoExample2HelperComponent {
  public modalCloseMessage$: Observable<string>;

  constructor(private readonly modalsService: ModalsService, private readonly injector: Injector) {}

  public openModal(): void {
    const modal: OpenedModal<string> = this.modalsService.open(ModalDemoExample2Component, {
      injector: this.injector,
      hasBackdrop: false,
      closeOnBackdropClick: false,
      isBackdropTransparent: false,
      providers: [
        {
          provide: MODAL_DATA_TOKEN,
          useValue: [1, 2, 3, 4],
        },
      ],
    });

    this.modalCloseMessage$ = modal.closed$;
  }
}
