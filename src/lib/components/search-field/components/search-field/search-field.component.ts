import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { filterFalsy, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMapTo, take, tap } from 'rxjs/operators';
import { InputBase } from '../../../../../internal/declarations/classes/abstract/input-base.abstract';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { CollapseDirection } from '../../../../../internal/declarations/types/collapse-direction.type';

const DEFAULT_COLLAPSE_DIRECTION: CollapseDirection = 'to-left';

@Component({
  selector: 'pupa-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFieldComponent extends InputBase<Nullable<string>> {
  @Input() public collapseDirection: CollapseDirection = DEFAULT_COLLAPSE_DIRECTION;
  public readonly collapseDirection$: BehaviorSubject<CollapseDirection> = new BehaviorSubject(
    DEFAULT_COLLAPSE_DIRECTION
  );

  @Input() public collapsible: boolean = false;
  public readonly isCollapsible$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private readonly isCollapsed$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  public readonly isShowInput$: Observable<boolean> = combineLatest([this.isCollapsible$, this.isCollapsed$]).pipe(
    map(([collapsible, collapsed]: [boolean, boolean]) => !(collapsible && collapsed))
  );

  private readonly searchFieldClassList$: Observable<string[]> = combineLatest([
    this.isCollapsible$.pipe(map((isCollapsible: boolean) => (isCollapsible ? 'collapsible' : null))),
    this.isShowInput$.pipe(map((isShowInput: boolean) => (isShowInput ? null : 'collapsed')))
  ]).pipe(
    map((classes: string[]) =>
      classes
        .filter((innerClass: string) => !isNil(innerClass))
        .map((innerProperty: string) => `search-field__input_${innerProperty}`)
    )
  );

  public readonly resultClassList$: Observable<string[]> = combineLatest([
    this.resultClassList$,
    this.searchFieldClassList$
  ]).pipe(
    map(([baseClassList, searchFieldClassList]: [string[], string[]]) => {
      const baseSearchFieldClassList: string[] = baseClassList.map((baseClass: string) => `search-field__${baseClass}`);
      return [...baseSearchFieldClassList, ...searchFieldClassList];
    })
  );

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
    this.isCollapsible$.subscribe((collapsible: boolean) => {
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
}
