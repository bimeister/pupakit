import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { SelectTriggerBase } from '../../../../declarations/classes/abstract/select-trigger-base.abstract';
import { SelectStateService } from '../../services/select-state.service';

@Component({
  selector: 'pupa-select-trigger-extra-case',
  templateUrl: './select-trigger-extra-case.component.html',
  styleUrls: ['./select-trigger-extra-case.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectTriggerExtraCaseComponent<T> extends SelectTriggerBase<T> {
  @ViewChild('overlayOrigin', { static: true }) protected readonly overlayOrigin: CdkOverlayOrigin;
  @ViewChild('button', { static: true }) protected readonly button: ElementRef<HTMLButtonElement>;

  constructor(selectStateService: SelectStateService<T>) {
    super(selectStateService);
  }
}
