import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { SelectButtonBase } from '../../../../../../internal/declarations/classes/abstract/select-button-base.abstract';
import { SelectStateService } from '../../../services/select-state.service';

@Component({
  selector: 'pupa-select-chip-button',
  templateUrl: './select-chip-button.component.html',
  styleUrls: ['./select-chip-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectChipButtonComponent<T> extends SelectButtonBase<T> {
  @ViewChild('overlayOrigin', { static: true }) protected readonly overlayOrigin: CdkOverlayOrigin;
  @ViewChild('button', { static: true }) protected readonly button: ElementRef<HTMLButtonElement>;

  public transparent: boolean = false;

  constructor(selectStateService: SelectStateService<T>) {
    super(selectStateService);
  }
}
