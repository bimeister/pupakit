import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentChange } from '../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../internal/declarations/interfaces/component-changes.interface';
import { LabelSize } from '../../../internal/declarations/types/label-size.type';

@Component({
  selector: 'pupa-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelComponent implements OnChanges {
  @Input() public readonly size: LabelSize = 'medium';
  public readonly size$: BehaviorSubject<LabelSize> = new BehaviorSubject<LabelSize>('medium');

  @Input() public readonly disabled: boolean = false;
  public readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public readonly icon: Nullable<string>;
  public readonly icon$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);

  public readonly resultClassList$: Observable<string[]> = combineLatest([
    this.size$,
    this.disabled$.pipe(map((isInvalid: boolean) => (isInvalid ? 'disabled' : null))),
  ]).pipe(
    map((classes: string[]) =>
      classes
        .filter((innerClass: string) => !isNil(innerClass))
        .map((innerProperty: string) => `label_${innerProperty}`)
    )
  );

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processDisabledChange(changes?.disabled);
    this.processIconChange(changes?.icon);
    this.processSizeChange(changes?.size);
  }

  private processSizeChange(change: ComponentChange<this, LabelSize>): void {
    const updatedValue: LabelSize | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.size$.next(updatedValue);
  }

  private processDisabledChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.disabled$.next(updatedValue);
  }

  private processIconChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (typeof updatedValue === 'undefined') {
      return;
    }

    this.icon$.next(updatedValue);
  }
}
