import { ChangeDetectionStrategy, Component, Injector, ViewEncapsulation } from '@angular/core';
import { ModalsService, OpenedModal } from '@bimeister/pupakit.overlays';
import { Observable } from 'rxjs';
import { ModalDemoExample4Component } from '../modal-content/modal-demo-example-4.component';

@Component({
  selector: 'pupa-modal-demo-example-4-helper',
  templateUrl: './modal-demo-example-4-helper.component.html',
  styleUrls: ['./modal-demo-example-4-helper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ModalDemoExample4HelperComponent {
  public modalCloseMessage$: Observable<string>;

  constructor(private readonly modalsService: ModalsService, private readonly injector: Injector) {}

  public openModal(): void {
    const modal: OpenedModal<string> = this.modalsService.open(ModalDemoExample4Component, {
      injector: this.injector,
    });

    this.modalCloseMessage$ = modal.closed$;
  }
}
