import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { filterNotNil, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';
import { mapTo, startWith, switchMap, withLatestFrom } from 'rxjs/operators';
import config from '../../../../assets/configs/adaptive-config.json';
import { UiState } from '../../../../internal/declarations/interfaces/ui-state.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientUiStateHandlerService implements OnDestroy {
  private readonly iframeElement$: BehaviorSubject<Nullable<HTMLIFrameElement>> = new BehaviorSubject<
    Nullable<HTMLIFrameElement>
  >(null);

  public readonly uiState$: BehaviorSubject<Nullable<UiState>> = new BehaviorSubject<Nullable<UiState>>(null);

  private readonly subscription: Subscription = new Subscription();
  constructor(@Inject(DOCUMENT) readonly document: Document) {
    this.subscription.add(this.handleIframeResizeEvents());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setIframeElement(iframe: Nullable<HTMLIFrameElement>): void {
    this.iframeElement$.next(iframe);
  }

  private handleIframeResizeEvents(): Subscription {
    return this.iframeElement$
      .pipe(
        filterNotNil(),
        switchMap((iframe: HTMLIFrameElement) =>
          fromEvent(iframe.contentWindow, 'resize').pipe(startWith(new Event('resize')), mapTo(iframe))
        ),
        withLatestFrom(this.uiState$)
      )
      .subscribe(([iframe, uiState]: [HTMLIFrameElement, UiState]) => {
        const { width: windowWidth, height: windowHeight }: ClientRect = iframe.getBoundingClientRect();

        const breakpoint: string = this.calculateBreakpoint();
        const countOfColumns: number = config.columns[breakpoint];

        this.setHtmlClassesByBreakpoint(uiState?.breakpoint ?? null, breakpoint);

        this.uiState$.next({ windowHeight, windowWidth, breakpoint, countOfColumns });

        this.setCalculatedVhSize(windowHeight);
      });
  }

  private calculateBreakpoint(): string {
    const queriesAll: [string, string][] = Object.entries(config.queries);

    const queriesCurrent: string[] = queriesAll
      .filter((query: [string, string]) => window.matchMedia(query[1]).matches)
      .flat(1);

    const breakpoint: string = queriesCurrent[0];

    return breakpoint;
  }

  private setHtmlClassesByBreakpoint(prevBreakpoint: string, breakpoint: string): void {
    const html: HTMLElement = this.document.body.parentElement;

    html.classList.add(breakpoint);
    if (isNil(prevBreakpoint) || isNil(breakpoint) || prevBreakpoint === breakpoint) {
      return;
    }
    html.classList.remove(prevBreakpoint);
  }

  private setCalculatedVhSize(windowHeight: number): void {
    if (isNil(windowHeight)) {
      return;
    }

    const vh: number = windowHeight * 0.01;
    this.document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}
