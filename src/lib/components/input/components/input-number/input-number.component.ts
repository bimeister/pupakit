import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { isEmpty, isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InputBase } from '../../../../../internal/declarations/classes/abstract/input-base.abstract';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { ValueType } from '../../../../../internal/declarations/types/input-value.type';

@Component({
  selector: 'pupa-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputNumberComponent extends InputBase<ValueType> {
  @Input() public withReset: boolean = false;

  @Input() public icon: string = '';
  public readonly icon$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public readonly hasCustomIcon$: Observable<boolean> = this.icon$.pipe(map((icon: string) => !isEmpty(icon)));
  public readonly rightPaddingPx$: Observable<number> = this.getRightPadding([
    this.isInvalid$,
    this.isVisibleReset$,
    this.hasCustomIcon$
  ]);

  public ngOnChanges(changes: ComponentChanges<this>): void {
    super.ngOnChanges(changes);
    this.processIconChange(changes?.icon);
  }

  public setValue(value: ValueType): void {
    const serializedValue: string = isNil(value) ? '' : String(value);
    this.value$.next(serializedValue);
  }

  public reset(): void {
    this.updateValue('');
    this.inputElementRef.nativeElement.focus();
  }

  private processIconChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.icon$.next(updatedValue);
  }
}
