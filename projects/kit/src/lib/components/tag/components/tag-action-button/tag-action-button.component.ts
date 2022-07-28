import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  AfterViewInit,
  ElementRef,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { subscribeOutsideAngular } from '../../../../../internal/functions/rxjs-operators/subscribe-outside-angular.operator';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { TagKind } from '../../../../../internal/declarations/types/tag-kind.type';
import { TagStateService } from '../../services/tag-state.service';

@Component({
  selector: 'pupa-tag-action-button',
  templateUrl: './tag-action-button.component.html',
  styleUrls: ['./tag-action-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagActionButtonComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() public readonly active: boolean = false;
  public isActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly isDisabled$: Observable<boolean> = this.tagStateService.isDisabled$;
  public readonly kindClass$: Observable<string> = this.tagStateService.kind$.pipe(
    map((kind: TagKind) => `button_${kind}`)
  );

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly tagStateService: TagStateService,
    private readonly hostElRef: ElementRef,
    private readonly ngZone: NgZone
  ) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processActiveChange(changes?.active);
  }

  public ngAfterViewInit(): void {
    this.subscription.add(this.processSelfClickAndTouch());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processActiveChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isActive$.next(updatedValue);
  }

  private processSelfClickAndTouch(): Subscription {
    return merge(
      fromEvent(this.hostElRef.nativeElement, 'click'),
      fromEvent(this.hostElRef.nativeElement, 'touchstart')
    )
      .pipe(subscribeOutsideAngular(this.ngZone), withLatestFrom(this.isDisabled$.pipe(take(1))))
      .subscribe(([event, isDisabled]: [Event, boolean]) => {
        if (isDisabled) {
          event.stopImmediatePropagation();
          return;
        }
        event.stopPropagation();
      });
  }
}
