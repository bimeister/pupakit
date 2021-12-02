import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { SelectButtonBase } from '../../../../../../internal/declarations/classes/abstract/select-button-base.abstract';
import { SelectStateService } from '../../../services/select-state.service';

@Component({
  selector: 'pupa-select-icon-button',
  templateUrl: './select-icon-button.component.html',
  styleUrls: ['./select-icon-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectIconButtonComponent<T> extends SelectButtonBase<T> {
  @ViewChild('overlayOrigin', { static: true }) protected readonly overlayOrigin: CdkOverlayOrigin;
  @ViewChild('button', { static: true }) protected readonly button: ElementRef<HTMLButtonElement>;

  @Input() public transparent: boolean = false;

  constructor(selectStateService: SelectStateService<T>) {
    super(selectStateService);
  }
}
