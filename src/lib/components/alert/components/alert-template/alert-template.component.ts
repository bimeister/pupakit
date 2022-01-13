import { AfterViewInit, ChangeDetectionStrategy, Component, TemplateRef, ViewEncapsulation } from '@angular/core';
import { isNil, Nullable } from '@bimeister/utilities';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

import { AlertComponentBase } from '../../../../../internal/declarations/classes/abstract/alert-component-base.abstract';
import { AlertTemplateData } from '../../../../../internal/declarations/interfaces/alert-template-data.interface';

@Component({
  selector: 'pupa-alert-template',
  templateUrl: './alert-template.component.html',
  styleUrls: ['./alert-template.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: AlertComponentBase.animations,
})
export class AlertTemplateComponent<TContext>
  extends AlertComponentBase<AlertTemplateData<TContext>, void>
  implements AfterViewInit
{
  public readonly templateRef: Nullable<TemplateRef<unknown>> = this.data.templateRef;
  public readonly templateContext: TContext = {
    ...this.data.templateContext,
    alertRef: this.alertRef,
  };

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.initTimer();
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
