import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
export class TagComponent implements OnChanges {
  @Input() public readonly disabled: boolean = false;
  public readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public readonly clickable: boolean = false;
  public readonly clickable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly resultClassList$: Observable<string[]> = combineLatest([
    this.disabled$.pipe(map((isDisabled: boolean) => (isDisabled ? 'disabled' : null))),
    this.clickable$.pipe(map((isClickable: boolean) => (isClickable ? 'clickable' : null)))
  ]).pipe(
    map((classes: string[]) =>
      classes.filter((innerClass: string) => !isNil(innerClass)).map((innerProperty: string) => `tag_${innerProperty}`)
    )
  );

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processDisabledChange(changes?.disabled);
    this.processClickableChange(changes?.clickable);
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
