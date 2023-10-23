import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { Nullable, isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { LabelIconPosition } from '../../../../declarations/types/label-icon-position.type';
import { LabelSize } from '../../../../declarations/types/label-size.type';

@Component({
  selector: 'pupa-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelComponent implements OnChanges {
  @Input() public size: LabelSize = 'medium';
  public readonly size$: BehaviorSubject<LabelSize> = new BehaviorSubject<LabelSize>('medium');

  @Input() public disabled: boolean = false;
  public readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public icon: Nullable<string>;
  public readonly icon$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);

  @Input() public iconPosition: LabelIconPosition = 'left';
  public readonly iconPosition$: BehaviorSubject<LabelIconPosition> = new BehaviorSubject<LabelIconPosition>('left');
  public readonly isReversedDirection$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
    this.processIconPositionChange(changes?.iconPosition);
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

  private processIconPositionChange(change: ComponentChange<this, LabelIconPosition>): void {
    const updatedValue: LabelIconPosition | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isReversedDirection$.next(updatedValue === 'right');
  }
}
