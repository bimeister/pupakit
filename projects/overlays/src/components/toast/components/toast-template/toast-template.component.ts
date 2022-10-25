import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';

import { TOAST_AUTO_CLOSE_TIME_MS } from '../../../../declarations/constants/toast-auto-close-time-ms.const';
import { ToastComponentBase } from '../../../../declarations/classes/abstract/toast-component-base.abstract';
import { ToastTemplateData } from '../../../../declarations/interfaces/toast-template-data.interface';

@Component({
  selector: 'pupa-toast-template',
  templateUrl: './toast-template.component.html',
  styleUrls: ['./toast-template.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: ToastComponentBase.animations,
})
export class ToastTemplateComponent<TContext>
  extends ToastComponentBase<ToastTemplateData<TContext>, boolean>
  implements AfterViewInit
{
  public readonly templateRef: TemplateRef<TContext> = this.data?.templateRef;
  public readonly templateContext: TContext = { ...this.data?.templateContext, toastRef: this.toastRef };

  private readonly autoCloseTimeMs: number = this.data?.autoCloseTimeMs ?? TOAST_AUTO_CLOSE_TIME_MS;

  private autoCloseTimerSubscription: Subscription | null = null;

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.initAutoCloseTimer();
  }

  @HostListener('mouseover')
  public processMouseover(): void {
    this.autoCloseTimerSubscription?.unsubscribe();
    this.autoCloseTimerSubscription = null;
  }

  @HostListener('mouseleave')
  public processMouseleave(): void {
    this.initAutoCloseTimer();
  }

  private initAutoCloseTimer(): void {
    this.autoCloseTimerSubscription?.unsubscribe();

    this.autoCloseTimerSubscription = timer(this.autoCloseTimeMs)
      .pipe(take(1))
      .subscribe(() => {
        this.toastRef.close();
      });
  }
}
