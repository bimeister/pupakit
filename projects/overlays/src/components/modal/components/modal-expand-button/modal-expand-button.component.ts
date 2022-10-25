import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ModalRef } from '../../../../declarations/classes/modal-ref.class';

@Component({
  selector: 'pupa-modal-expand-button',
  templateUrl: './modal-expand-button.component.html',
  styleUrls: ['./modal-expand-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalExpandButtonComponent {
  public icon$: Observable<string> = this.modalRef.isFullscreen$.pipe(
    map((isFullscreen: boolean) => (isFullscreen ? 'app-fit-to-page' : 'app-resize'))
  );

  constructor(@Inject(ModalRef) private readonly modalRef: ModalRef) {}

  public handleClick(): void {
    this.modalRef.isFullscreen$
      .pipe(take(1))
      .subscribe((isFullscreen: boolean) => this.modalRef.changeFullscreenMode(!isFullscreen));
  }
}
