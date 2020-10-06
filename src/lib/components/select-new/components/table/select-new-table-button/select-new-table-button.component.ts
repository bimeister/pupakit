import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';

import { SelectNewStateService } from '../../../services/select-new-state.service';
import { SelectButtonBase } from './../../../../../../internal/declarations/classes/abstract/select-button-base.abstract';

@Component({
  selector: 'pupa-select-new-table-button',
  templateUrl: './select-new-table-button.component.html',
  styleUrls: ['./select-new-table-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectNewTableButtonComponent<T> extends SelectButtonBase<T> {
  @ViewChild('overlayOrigin', { static: true }) protected readonly overlayOrigin: CdkOverlayOrigin;
  @ViewChild('button', { static: true }) protected readonly button: ElementRef<HTMLButtonElement>;

  @Input() public transparent: boolean = false;

  constructor(selectNewStateService: SelectNewStateService<T>) {
    super(selectNewStateService);
  }
}
