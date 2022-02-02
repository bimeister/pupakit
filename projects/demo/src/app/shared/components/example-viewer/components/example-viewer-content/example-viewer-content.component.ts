import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { filterTruthy, isEmpty, isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable, ReplaySubject, Subscriber } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { ComponentChange } from '../../../../../../../../src/internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../../../../src/internal/declarations/interfaces/component-changes.interface';

const CONTENT_TOP_STYLE_PX: number = 80;

const IS_STICKY_DEFAULT: boolean = true;

@Component({
  selector: 'demo-example-viewer-content',
  templateUrl: './example-viewer-content.component.html',
  styleUrls: ['./example-viewer-content.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleViewerContentComponent implements AfterViewInit, OnChanges {
  @Input() public isSticky: boolean = IS_STICKY_DEFAULT;
  public readonly isSticky$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(IS_STICKY_DEFAULT);

  @ViewChild('intersectionIndicator') public intersectionIndicatorElement: ElementRef<Element>;

  public readonly intersectionIndicatorElement$: ReplaySubject<ElementRef<Element>> = new ReplaySubject<
    ElementRef<Element>
  >();

  private readonly intersectionObserver$: Observable<IntersectionObserverEntry> = this.isSticky$.pipe(
    filterTruthy(),
    switchMap(() => this.intersectionIndicatorElement$),
    switchMap((element: ElementRef<Element>) =>
      this.createIntersectionObserverForElement(element.nativeElement, {
        rootMargin: `-${CONTENT_TOP_STYLE_PX}px 0px 0px 0px`,
      })
    )
  );

  public readonly isUnstuck$: Observable<boolean> = this.intersectionObserver$.pipe(
    map((entry: IntersectionObserverEntry) => !entry.isIntersecting),
    distinctUntilChanged()
  );

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processIsStickyChange(changes?.isSticky);
  }

  public ngAfterViewInit(): void {
    if (isNil(this.intersectionIndicatorElement)) {
      return;
    }

    this.intersectionIndicatorElement$.next(this.intersectionIndicatorElement);
  }

  private processIsStickyChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isEmpty(updatedValue)) {
      return;
    }

    this.isSticky$.next(updatedValue);
  }

  private createIntersectionObserverForElement(
    element: Element,
    options: IntersectionObserverInit
  ): Observable<IntersectionObserverEntry> {
    return new Observable<IntersectionObserverEntry>((subscriber: Subscriber<IntersectionObserverEntry>) => {
      const observer: IntersectionObserver = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
        subscriber.next(entry);
      }, options);

      observer.observe(element);

      return () => {
        observer.unobserve(element);
      };
    });
  }
}
