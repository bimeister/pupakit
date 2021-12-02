import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Renderer2 } from '@angular/core';

import { PositionController } from '../../../../../internal/declarations/classes/abstract/position-controller.abstract';

/** @dynamic */
@Component({
  selector: 'pupa-dragger',
  templateUrl: './dragger.component.html',
  styleUrls: ['./dragger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraggerComponent extends PositionController {
  constructor(
    protected readonly renderer: Renderer2,
    protected readonly elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) protected readonly document: Document
  ) {
    super(renderer, elementRef, document);
  }
}
