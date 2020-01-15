import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

import { isNullOrUndefined } from './../../helpers/is-null-or-undefined.helper';
import { Alert, AlertsService } from './../services/alerts.service';

@Component({
  selector: 'pupa-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('openAlert', [
      state('false', style({ height: '0px' })),
      state('true', style({ height: '*' })),
      transition('false => true', animate('0.2s')),
      transition('true => false', animate('0.2s'))
    ])
  ]
})
export class AlertComponent implements AfterContentInit {
  @Input()
  public readonly alert: Alert;

  public isVisible: boolean = false;

  private readonly lifetime: number = 3000;

  constructor(private readonly alertsService: AlertsService, private readonly changeDetector: ChangeDetectorRef) {}

  public ngAfterContentInit(): void {
    this.isVisible = true;
    this.changeDetector.detectChanges();
    if (!isNullOrUndefined(this.alert.needClosed) && this.alert.needClosed) {
      return;
    }
    setTimeout(() => {
      this.closeAlert();
    }, this.lifetime);
  }

  public close(event: MouseEvent): void {
    event.stopPropagation();
    this.closeAlert();
  }

  public closeAlert(): void {
    this.isVisible = false;
    this.changeDetector.detectChanges();
  }

  public processAnimationEnd(event: AnimationEvent): void {
    const animationDone: boolean = String(event.toState) === 'false';
    if (!animationDone) {
      return;
    }
    this.alertsService.closeAlertById(this.alert.id);
  }
}
