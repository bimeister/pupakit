import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';

import { SelectStateService } from '../../../services/select-state.service';
import { SelectButtonBase } from './../../../../../../internal/declarations/classes/abstract/select-button-base.abstract';

@Component({
  selector: 'pupa-select-table-button',
  templateUrl: './select-table-button.component.html',
  styleUrls: ['./select-table-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectTableButtonComponent<T> extends SelectButtonBase<T> {
  @ViewChild('overlayOrigin', { static: true }) protected readonly overlayOrigin: CdkOverlayOrigin;
  @ViewChild('button', { static: true }) protected readonly button: ElementRef<HTMLButtonElement>;

  @Input() public transparent: boolean = false;

  constructor(selectStateService: SelectStateService<T>) {
    super(selectStateService);
  }
}
