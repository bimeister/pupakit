import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  OnInit,
  OnDestroy
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, switchMap, take, takeUntil, takeWhile } from 'rxjs/operators';
import { isNil } from '@bimeister/utilities';

import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';

@Component({
  selector: 'pupa-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent implements OnChanges, OnInit, OnDestroy {
  @Input() public readonly disabled: boolean = false;
  private readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public readonly clickable: boolean = false;
  private readonly clickable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly active$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly resultClassList$: Observable<string[]> = combineLatest([
    this.clickable$.pipe(map((isClickable: boolean) => (isClickable ? 'clickable' : null))),
    this.active$.pipe(map((isActive: boolean) => (isActive ? 'active' : null))),
    this.disabled$.pipe(map((isDisabled: boolean) => (isDisabled ? 'disabled' : null)))
  ]).pipe(
    map((classes: string[]) =>
      classes.filter((innerClass: string) => !isNil(innerClass)).map((innerProperty: string) => `tag_${innerProperty}`)
    )
  );

  private readonly destroyed$: Subject<void> = new Subject<void>();

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processDisabledChange(changes?.disabled);
    this.processClickableChange(changes?.clickable);
  }

  public ngOnInit(): void {
    this.deactivateTagWhenDisabled();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public deactivateTagWhenDisabled(): void {
    this.disabled$.pipe(takeUntil(this.destroyed$)).subscribe(isDisabled => {
      if (isDisabled) {
        this.active$.next(false);
      }
    });
  }

  public handleClick(): void {
    this.disabled$
      .pipe(
        takeWhile(isDisabled => !isDisabled),
        switchMap(() => this.clickable$),
        takeWhile(isClickable => isClickable),
        switchMap(() => this.active$),
        take(1)
      )
      .subscribe(value => {
        this.active$.next(!value);
      });
  }

  private processDisabledChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.disabled$.next(updatedValue);
  }

  private processClickableChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.clickable$.next(updatedValue);
  }
}
