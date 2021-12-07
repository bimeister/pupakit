import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { SelectStateService } from '../../services/select-state.service';
import { SelectButtonBase } from './../../../../../internal/declarations/classes/abstract/select-button-base.abstract';

@Component({
  selector: 'pupa-select-trigger',
  templateUrl: './select-trigger.component.html',
  styleUrls: ['./select-trigger.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectTriggerComponent<T> extends SelectButtonBase<T> {
  @ViewChild('overlayOrigin', { static: true }) protected readonly overlayOrigin: CdkOverlayOrigin;
  @ViewChild('button', { static: true }) protected readonly button: ElementRef<HTMLButtonElement>;

  constructor(selectStateService: SelectStateService<T>) {
    super(selectStateService);
  }
}
