import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import {
  appAttentionFilledIcon,
  appCheckRoundFilledIcon,
  appErrorFilledIcon,
  appInfoFilledIcon,
} from '@bimeister/pupakit.icons';
import { Observable, Subscription } from 'rxjs';
import { CalloutService } from '../../services/callout.service';

type CalloutKind = 'info' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'pupa-callout',
  templateUrl: './callout.component.html',
  styleUrls: ['./callout.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CalloutService],
})
export class CalloutComponent implements AfterContentInit, OnDestroy {
  @Input() public kind: CalloutKind = 'info';

  public readonly hasHeader$: Observable<boolean> = this.calloutService.hasHeader$;

  public readonly isCollapsed$: Observable<boolean> = this.calloutService.isCollapsed$;

  public readonly icons: Map<CalloutKind, string> = new Map<CalloutKind, string>([
    ['info', appInfoFilledIcon.name],
    ['success', appCheckRoundFilledIcon.name],
    ['warning', appAttentionFilledIcon.name],
    ['danger', appErrorFilledIcon.name],
  ]);

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly hostElement: ElementRef<HTMLElement>, private readonly calloutService: CalloutService) {}

  public ngAfterContentInit(): void {
    this.subscription.add(this.processCloseEvent());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processCloseEvent(): Subscription {
    return this.calloutService.isClosed$.subscribe(() => {
      this.ngOnDestroy();
      this.hostElement.nativeElement.remove();
    });
  }
}
