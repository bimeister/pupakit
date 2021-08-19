import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { ButtonKind } from '../../../../../internal/declarations/types/button-kind.type';
import { ButtonSize } from '../../../../../internal/declarations/types/button-size.type';
import { ButtonType } from '../../../../../internal/declarations/types/button-type.type';

@Component({
  selector: 'pupa-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class ButtonComponent {
  @Input() public readonly size: ButtonSize = 'medium';
  public readonly size$: BehaviorSubject<ButtonSize> = new BehaviorSubject<ButtonSize>('medium');

  @Input() public readonly kind: ButtonKind = 'primary';
  public readonly kind$: BehaviorSubject<ButtonKind> = new BehaviorSubject<ButtonKind>('primary');

  @Input() public readonly type: ButtonType = 'submit';
  public readonly type$: BehaviorSubject<ButtonType> = new BehaviorSubject<ButtonType>('submit');

  @Input() public readonly disabled: boolean = false;
  public readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly resultClassList$: Observable<string[]> = combineLatest([
    this.size$,
    this.kind$,
    this.disabled$.pipe(map((isDisabled: boolean) => (isDisabled ? 'disabled' : null)))
  ]).pipe(
    map((classes: string[]) =>
      classes
        .filter((innerClass: string) => !isNil(innerClass))
        .map((innerProperty: string) => `button__${innerProperty}`)
    )
  );

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processSizeChange(changes?.size);
    this.processTypeChange(changes?.type);
    this.processKindChange(changes?.kind);
    this.processDisabledChange(changes?.disabled);
  }

  private processSizeChange(change: ComponentChange<this, ButtonSize>): void {
    const updatedValue: ButtonSize | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.size$.next(updatedValue);
  }

  private processTypeChange(change: ComponentChange<this, ButtonType>): void {
    const updatedValue: ButtonType | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.type$.next(updatedValue);
  }

  private processKindChange(change: ComponentChange<this, ButtonKind>): void {
    const updatedValue: ButtonKind | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.kind$.next(updatedValue);
  }

  private processDisabledChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.disabled$.next(updatedValue);
  }
}
