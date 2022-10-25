import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Nullable } from '@bimeister/utilities';
import { Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';

import { TOAST_AUTO_CLOSE_TIME_MS } from '../../../../declarations/constants/toast-auto-close-time-ms.const';
import { ToastComponentBase } from '../../../../declarations/classes/abstract/toast-component-base.abstract';
import { ToastData } from '../../../../declarations/interfaces/toast-data.interface';
import { ToastType } from '../../../../declarations/types/toast-type.type';
import { TimerRoundComponent } from '@bimeister/pupakit.kit';

@Component({
  selector: 'pupa-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: ToastComponentBase.animations,
})
export class ToastComponent extends ToastComponentBase<ToastData, boolean> implements AfterViewInit {
  @ViewChild(TimerRoundComponent) private readonly timer?: TimerRoundComponent;

  public readonly type: ToastType = this.data?.type ?? 'info';

  public readonly bodyText: string = this.data?.bodyText ?? '';
  public readonly actionText: Nullable<string> = this.data?.actionText;

  private readonly autoCloseTimeMs: number = this.data?.autoCloseTimeMs ?? TOAST_AUTO_CLOSE_TIME_MS;
  public readonly autoCloseTimeSeconds: number = this.autoCloseTimeMs / 1000;

  public readonly hasTimer: boolean = this.data.hasTimer ?? false;
  private autoCloseTimerSubscription: Subscription | null = null;

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.initAutoCloseTimer();
  }

  public processActionClick(): void {
    this.toastRef.close(true);
  }

  @HostListener('mouseover')
  public processMouseover(): void {
    this.autoCloseTimerSubscription?.unsubscribe();
    this.autoCloseTimerSubscription = null;
    this.timer?.stop();
  }

  @HostListener('mouseleave')
  public processMouseleave(): void {
    this.initAutoCloseTimer();
    this.timer?.restart();
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
