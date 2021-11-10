import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { InputBase } from '../../../../../internal/declarations/classes/abstract/input-base.abstract';
import { ValueType } from '../../../../../internal/declarations/types/input-value.type';

@Component({
  selector: 'pupa-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputPasswordComponent extends InputBase<ValueType> {
  private readonly isEnabled$: Observable<boolean> = this.isDisabled$.pipe(map((isDisabled: boolean) => !isDisabled));
  public readonly rightPadding$: Observable<number> = this.getRightPadding([this.isInvalid$, this.isEnabled$]);
  public readonly typeIsText$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public togglePassword(): void {
    this.typeIsText$.pipe(take(1)).subscribe((typeIsText: boolean) => this.typeIsText$.next(!typeIsText));
  }

  public setValue(value: ValueType): void {
    const serializedValue: string = isNil(value) ? '' : String(value);
    this.value$.next(serializedValue);
  }
}
