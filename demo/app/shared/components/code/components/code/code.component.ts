import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';

import { Clipboard } from '@angular/cdk/clipboard';
import { ComponentChanges } from '../../../../../../../src/internal/declarations/interfaces/component-changes.interface';
import { Alert } from '../../../../../../../src/internal/declarations/interfaces/alert.interface';
import { ComponentChange } from '../../../../../../../src/internal/declarations/interfaces/component-change.interface';
import { AlertsService } from '../../../../../../../src/public-api';

@Component({
  selector: 'pupa-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeComponent implements OnChanges {
  @Input() public readonly code: string = '';
  public readonly code$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private readonly cdkClipboard: Clipboard, private readonly alertsService: AlertsService) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processCodeChange(changes?.code);
  }

  public copyToClipBoard(code: string): void {
    this.cdkClipboard.copy(code);
    this.addSuccessAlert('Скопировано в буфер обмена');
  }

  public addSuccessAlert(text: string): void {
    const alert: Alert = {
      id: null,
      text,
      type: 'success',
      needToBeClosed: false
    };
    this.alertsService.create(alert).subscribe();
  }

  private processCodeChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.code$.next(updatedValue.trim());
  }
}
