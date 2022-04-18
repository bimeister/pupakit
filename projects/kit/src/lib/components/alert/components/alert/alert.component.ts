import { AfterViewInit, ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { isEmpty, isNil, Nullable } from '@bimeister/utilities';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

import { AlertComponentBase } from '../../../../../internal/declarations/classes/abstract/alert-component-base.abstract';
import { AlertButton } from '../../../../../internal/declarations/interfaces/alert-button.interface';
import { AlertData } from '../../../../../internal/declarations/interfaces/alert-data.interface';
import { AlertType } from '../../../../../internal/declarations/types/alert-type.type';

@Component({
  selector: 'pupa-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: AlertComponentBase.animations,
})
export class AlertComponent extends AlertComponentBase<AlertData, void> implements AfterViewInit {
  public readonly type: AlertType = this.data.type ?? 'info';

  public readonly title: string = this.data.title ?? '';
  public readonly hasTitle: boolean = this.title !== '';
  public readonly hasCloseButton: boolean = this.data.hasCloseButton ?? false;

  public readonly bodyText: Nullable<string> = this.data.bodyText;

  public readonly buttons: AlertButton[] = this.data.buttons ?? [];

  public readonly hasHeader: boolean = this.hasTitle;
  public readonly hasButtons: boolean = !isEmpty(this.buttons);

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.initTimer();
  }

  public processCloseButtonClick(): void {
    this.data.closeAction?.();
  }

  private initTimer(): void {
    if (isNil(this.data.autoCloseTimeMs)) {
      return;
    }

    timer(this.data.autoCloseTimeMs)
      .pipe(take(1))
      .subscribe(() => {
        this.alertRef.close();
      });
  }
}
