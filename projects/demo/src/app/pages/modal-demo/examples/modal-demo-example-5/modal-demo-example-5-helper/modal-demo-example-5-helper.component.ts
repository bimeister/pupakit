import { ChangeDetectionStrategy, Component, Injector, ViewEncapsulation } from '@angular/core';
import { ModalsService, OpenedModal } from '@bimeister/pupakit.overlays';
import { Observable } from 'rxjs';
import { MODAL_DATA_TOKEN } from '../../../../../../declarations/tokens/modal-data.token';
import { ModalDemoExample5Component } from '../modal-content/modal-demo-example-5.component';

@Component({
  selector: 'pupa-modal-demo-example-5-helper',
  templateUrl: './modal-demo-example-5-helper.component.html',
  styleUrls: ['./modal-demo-example-5-helper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ModalDemoExample5HelperComponent {
  public modalCloseMessage$: Observable<string>;

  constructor(private readonly modalsService: ModalsService, private readonly injector: Injector) {}

  public openModal(): void {
    const modal: OpenedModal<string> = this.modalsService.open(ModalDemoExample5Component, {
      injector: this.injector,
      hasBackdrop: true,
      closeOnBackdropClick: true,
      isBackdropTransparent: false,
      height: 'xs',
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
