import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ClientUiStateHandlerService } from '@bimeister/pupakit.common';
import { DOCUMENT } from '@angular/common';

const ADAPTIVE_CSS_CLASS: string = 'adaptive';

@Component({
  selector: 'demo-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly clientUiStateHandlerService: ClientUiStateHandlerService,
    private readonly renderer: Renderer2,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  public ngOnInit(): void {
    this.subscription.add(this.processIsAdaptive());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processIsAdaptive(): Subscription {
    return this.clientUiStateHandlerService.isAdaptive$.subscribe((isAdaptive: boolean) => {
      if (isAdaptive) {
        this.renderer.addClass(this.document.documentElement, ADAPTIVE_CSS_CLASS);
      } else {
        this.renderer.removeClass(this.document.documentElement, ADAPTIVE_CSS_CLASS);
      }
    });
  }
}
