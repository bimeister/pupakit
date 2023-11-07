import { ChangeDetectionStrategy, Component, Input, OnChanges, Optional, ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { Nullable, filterFalsy, isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable, ReplaySubject, Subscription, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, switchMapTo, take, tap } from 'rxjs/operators';
import { InputBase } from '../../../../declarations/classes/abstract/input-base.abstract';
import { CollapseDirection } from '../../../../declarations/types/collapse-direction.type';

const DEFAULT_COLLAPSE_DIRECTION: CollapseDirection = 'to-left';

@Component({
  selector: 'pupa-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldComponent extends InputBase<Nullable<string>> implements OnChanges {
  @Input() public collapseDirection: CollapseDirection = DEFAULT_COLLAPSE_DIRECTION;
  public readonly collapseDirection$: BehaviorSubject<CollapseDirection> = new BehaviorSubject(
    DEFAULT_COLLAPSE_DIRECTION
  );

  @Input() public autofocus: boolean = false;

  @Input() public collapsible: boolean = false;
  public readonly isCollapsible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly isCollapsed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  @Input() public maxLength: number | null = null;

  public readonly resultClassList$: Observable<string[]> = combineLatest([
    this.isCollapsible$.pipe(map((isCollapsible: boolean) => (isCollapsible ? 'collapsible' : null))),
    this.isCollapsed$.pipe(map((isCollapsed: boolean) => (isCollapsed ? 'collapsed' : null))),
  ]).pipe(
    map((classes: string[]) =>
      classes
        .filter((innerClass: string) => !isNil(innerClass))
        .map((innerProperty: string) => `search-field__input_${innerProperty}`)
    )
  );

  constructor(@Optional() ngControl: NgControl) {
    super(ngControl);

    this.subscription.add(this.processIsCollapsedWhenIsCollapsibleChanged());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    super.ngOnChanges(changes);
    this.processCollapsibleChange(changes?.collapsible);
    this.processCollapseDirectionChange(changes?.collapseDirection);
  }

  public setValue(value: Nullable<string>): void {
    const serializedValue: string = isNil(value) ? '' : String(value);
    this.value$.next(serializedValue);
  }

  public reset(): void {
    this.updateValue('');
    this.isCollapsible$.pipe(take(1)).subscribe((collapsible: boolean) => {
      if (collapsible) {
        this.isCollapsed$.next(true);
        return;
      }
      this.inputElementRef.nativeElement.focus();
    });
  }

  public changeCollapsed(): void {
    this.isDisabled$
      .pipe(
        take(1),
        filterFalsy(),
        switchMapTo(this.isCollapsed$),
        take(1),
        map((collapsed: boolean) => !collapsed),
        tap((nextCollapsed: boolean) => {
          if (!nextCollapsed) {
            this.inputElementRef.nativeElement.focus();
          }
        })
      )
      .subscribe((nextCollapsed: boolean) => this.isCollapsed$.next(nextCollapsed));
  }

  private processCollapsibleChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: Nullable<boolean> = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isCollapsible$.next(updatedValue);
  }

  private processCollapseDirectionChange(change: ComponentChange<this, CollapseDirection>): void {
    const updatedValue: Nullable<CollapseDirection> = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.collapseDirection$.next(updatedValue);
  }

  private processIsCollapsedWhenIsCollapsibleChanged(): Subscription {
    return this.isCollapsible$.pipe(distinctUntilChanged()).subscribe((isCollapsible: boolean) => {
      this.isCollapsed$.next(isCollapsible);
    });
  }
}
