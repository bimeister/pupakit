import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { OptionActionsRightDirective } from '../../directives/option-actions-right.directive';
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isNil } from '@bimeister/utilities';
import { ComponentChanges, ComponentChange, isTabletDevice } from '@bimeister/pupakit.common';

@Component({
  selector: 'pupa-option, a[pupaOptionLink]',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionComponent implements OnChanges, AfterViewInit, OnDestroy {
  @ContentChild(OptionActionsRightDirective) public readonly optionActionsRightDirective: OptionActionsRightDirective;
  @ViewChild('content') private readonly content: ElementRef<HTMLDivElement>;

  @Input() public disabled: boolean = false;
  @Input() public active: boolean = false;
  @Input() public hasCheckbox: boolean = false;
  @Input() public forceResetHover: boolean = true;

  public readonly hovered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly subscription: Subscription = new Subscription();

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (this.hasCheckbox) {
      this.processForceResetHoverChange(changes?.forceResetHover);
    }
  }

  public ngAfterViewInit(): void {
    this.subscription.add(this.subscribeToContentMouseEnter());
    this.subscription.add(this.subscribeToContentMouseLeave());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processForceResetHoverChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;
    if (isNil(updatedValue)) {
      return;
    }

    if (!updatedValue) {
      return this.hovered$.next(false);
    }
  }

  private subscribeToContentMouseEnter(): Subscription {
    return fromEvent(this.content.nativeElement, 'mouseenter')
      .pipe(filter(() => !this.disabled && !Boolean(isTabletDevice())))
      .subscribe(() => {
        this.hovered$.next(true);
      });
  }

  private subscribeToContentMouseLeave(): Subscription {
    return fromEvent(this.content.nativeElement, 'mouseleave')
      .pipe(filter(() => !this.disabled && !Boolean(isTabletDevice())))
      .subscribe(() => {
        this.hovered$.next(false);
      });
  }
}
