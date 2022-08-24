import { Clipboard } from '@angular/cdk/clipboard';
import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, UrlTree } from '@angular/router';
import { filterByInstanceOf, isEmpty, isNil, Nullable } from '@bimeister/utilities';
import { ToastsService } from '@kit/internal/shared/services/toasts.service';
import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { filter, map, pairwise, startWith, switchMap, take, withLatestFrom } from 'rxjs/operators';

type AnchorList = Map<string, HTMLElement>;

const PAGE_OR_TAB_FIRST_ANCHOR_SCROLLING_DELAY_MS: number = 1000;
const PAGE_OR_TAB_NOT_FIRST_ANCHOR_SCROLLING_DELAY_MS: number = 0;

@Injectable()
export class AnchorService implements OnDestroy {
  private readonly anchorList$: BehaviorSubject<AnchorList> = new BehaviorSubject<AnchorList>(
    new Map<string, HTMLElement>()
  );

  private readonly navigationEnd$: Observable<{ pageOrTabChanged: boolean }> = this.router.events.pipe(
    filterByInstanceOf(NavigationEnd),
    map(() => this.getPathWithoutFragment()),
    pairwise(),
    map(([previousPathWithoutFragment, currentPathWithoutFragment]: [string, string]) => ({
      pageOrTabChanged: previousPathWithoutFragment !== currentPathWithoutFragment,
    })),
    startWith({ pageOrTabChanged: true })
  );

  private readonly subscription: Subscription = new Subscription();

  private readonly scrollableParent$: BehaviorSubject<Nullable<HTMLElement>> = new BehaviorSubject<
    Nullable<HTMLElement>
  >(null);
  private readonly scrollableParentRequiredIndentFromTop$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public readonly anchorNameFromUrl$: Observable<Nullable<string>> = this.activatedRoute.fragment;

  private readonly animateActiveAnchor$: Subject<void> = new Subject<void>();
  public readonly animateActiveAnchorEvent$: Observable<void> = this.animateActiveAnchor$.asObservable();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly cdkClipboard: Clipboard,
    private readonly toastsService: ToastsService,
    private readonly router: Router
  ) {
    this.subscription.add(this.navigationEndHandler());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setScrollableParent(scrollableParent: HTMLElement): void {
    this.scrollableParent$.next(scrollableParent);
  }

  public setScrollableParentRequiredIndentFromTop(indentFromTop: number): void {
    this.scrollableParentRequiredIndentFromTop$.next(indentFromTop);
  }

  public registerAnchor(anchorName: string, anchorElement: HTMLElement): void {
    this.anchorList$
      .pipe(
        take(1),
        map((anchorList: AnchorList) => anchorList.set(anchorName, anchorElement))
      )
      .subscribe((updatedAnchorList: AnchorList) => this.anchorList$.next(updatedAnchorList));
  }

  public unregisterAnchor(anchorName: string): void {
    this.anchorList$
      .pipe(
        take(1),
        map((anchorList: AnchorList) => {
          anchorList.delete(anchorName);
          return anchorList;
        })
      )
      .subscribe((updatedAnchorList: AnchorList) => this.anchorList$.next(updatedAnchorList));
  }

  public copyHrefAndShowToast(anchorName: string): void {
    const fragmentFinderRegex: RegExp = /#[\w|а-яА-Я].*$/g;
    const hrefWithNewAnchor: string = `${location.href.replace(fragmentFinderRegex, '')}#${anchorName}`;

    this.cdkClipboard.copy(hrefWithNewAnchor);
    this.toastsService.open({ data: { bodyText: 'Copied to clipboard', type: 'success' } });
  }

  public parseAnchorNameFromElement(element: HTMLElement): Nullable<string> {
    const textContent: string = element?.textContent?.trim();

    if (isEmpty(textContent)) {
      return null;
    }

    const nonWordsGroupsRegex: RegExp = /[^\w|а-яА-Я]+/g;
    const parsedAnchorName: string = textContent.replaceAll(nonWordsGroupsRegex, '-');

    return isEmpty(parsedAnchorName) ? null : parsedAnchorName;
  }

  private getPathWithoutFragment(): string {
    const urlTree: UrlTree = this.router.parseUrl(this.router.url);
    urlTree.fragment = null;
    return urlTree.toString();
  }

  private navigationEndHandler(): Subscription {
    return this.navigationEnd$
      .pipe(
        switchMap(({ pageOrTabChanged }: { pageOrTabChanged: boolean }) =>
          timer(
            pageOrTabChanged
              ? PAGE_OR_TAB_FIRST_ANCHOR_SCROLLING_DELAY_MS
              : PAGE_OR_TAB_NOT_FIRST_ANCHOR_SCROLLING_DELAY_MS
          )
        ),
        switchMap(() =>
          this.anchorList$.pipe(
            take(1),
            withLatestFrom(this.anchorNameFromUrl$),
            map(([anchorList, anchorName]: [AnchorList, Nullable<string>]) => anchorList.get(anchorName))
          )
        ),
        filter((anchorElement: Nullable<HTMLElement>) => !isNil(anchorElement))
      )
      .subscribe((anchorElement: HTMLElement) => {
        this.scrollToElement(anchorElement);
        this.animateActiveAnchor$.next();
      });
  }

  private scrollToElement(element: HTMLElement): void {
    this.scrollableParent$
      .pipe(take(1), withLatestFrom(this.scrollableParentRequiredIndentFromTop$))
      .subscribe(([scrollableParent, scrollableParentRequiredIndentFromTop]: [HTMLElement, number]) => {
        if (isNil(scrollableParent)) {
          return this.scrollElementToScreenCenter(element);
        }

        const scrollableParentScrollTop: number = element.offsetTop - scrollableParentRequiredIndentFromTop;
        this.scrollElementTo(scrollableParent, scrollableParentScrollTop);
      });
  }

  private scrollElementToScreenCenter(element: HTMLElement): void {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  }

  private scrollElementTo(element: HTMLElement, top: number): void {
    element.scrollTo({
      behavior: 'smooth',
      top,
    });
  }
}
