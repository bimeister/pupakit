import { ChangeDetectionStrategy, Component, ElementRef, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConnectedPositionX, ConnectedPositionY, ModalsService } from '@bimeister/pupakit.overlays';
import { MODAL_DATA_TOKEN } from '../../../../../../declarations/tokens/modal-data.token';
import { ModalDemoExample7Component } from '../modal-content/modal-demo-example-7.component';
import { FormControl } from '@angular/forms';
import { isNil, Nullable } from '@bimeister/utilities';
import { Position } from '@bimeister/pupakit.common';

@Component({
  selector: 'pupa-modal-demo-example-7-helper',
  templateUrl: './modal-demo-example-7-helper.component.html',
  styleUrls: ['./modal-demo-example-7-helper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ModalDemoExample7HelperComponent {
  @ViewChild('container', { read: ElementRef }) public modalContainerEl: ElementRef<HTMLElement>;

  public readonly modalXPosition: FormControl<string | null> = new FormControl<string | null>(null);
  public readonly modalYPosition: FormControl<string | null> = new FormControl<string | null>(null);
  public readonly modalXOverlay: FormControl<ConnectedPositionX> = new FormControl<ConnectedPositionX>('center');
  public readonly modalYOverlay: FormControl<ConnectedPositionY> = new FormControl<ConnectedPositionY>('center');
  public readonly insideHostContainer: FormControl<boolean> = new FormControl<boolean>(false);

  constructor(private readonly modalsService: ModalsService, private readonly injector: Injector) {}

  public openModal(): void {
    this.modalsService.open(ModalDemoExample7Component, {
      injector: this.injector,
      hasBackdrop: false,
      closeOnBackdropClick: false,
      isBackdropTransparent: false,
      position: this.getModalPosition(),
      hasBorder: true,
      providers: [
        {
          provide: MODAL_DATA_TOKEN,
          useValue: [1, 2, 3, 4],
        },
      ],
      viewport: this.getViewport(),
      overlayX: this.modalXOverlay.value,
      overlayY: this.modalYOverlay.value,
    });
  }

  private getModalPosition(): Position | null {
    const x: string | null = this.modalXPosition.value;
    const y: string | null = this.modalYPosition.value;

    return isNil(x) || isNil(y) ? null : [parseInt(x, 10), parseInt(y, 10)];
  }

  private getViewport(): Nullable<ElementRef<HTMLElement>> {
    if (typeof this.insideHostContainer.value === 'boolean' && this.insideHostContainer.value) {
      return this.modalContainerEl;
    }
    return null;
  }
}
