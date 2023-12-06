import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { SelectStateService } from '../../services/select-state.service';
import { SelectTriggerBase } from '../../../../declarations/classes/abstract/select-trigger-base.abstract';

@Component({
  selector: 'pupa-select-trigger',
  templateUrl: './select-trigger.component.html',
  styleUrls: ['./select-trigger.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectTriggerComponent<T> extends SelectTriggerBase<T> {
  @ViewChild('overlayOrigin', { static: true }) protected readonly overlayOrigin: CdkOverlayOrigin;
  @ViewChild('button', { static: true }) protected readonly button: ElementRef<HTMLElement>;

  constructor(selectStateService: SelectStateService<T>) {
    super(selectStateService);
  }
}
