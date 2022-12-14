import { ChangeDetectionStrategy, Component, HostListener, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { ButtonType } from '../../../../declarations/types/button-type.type';
import { filterTruthy, isNil, Nullable } from '@bimeister/utilities';
import { ButtonIconPosition } from '../../../../declarations/types/button-icon-position.type';
import { map, take } from 'rxjs/operators';
import { ButtonKind } from '../../../../declarations/types/button-kind.type';
import { ButtonSize } from '../../../../declarations/types/button-size.type';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';

@Component({
  selector: 'pupa-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent implements OnChanges {
  @Input() public readonly size: ButtonSize = 'l';
  public readonly size$: BehaviorSubject<ButtonSize> = new BehaviorSubject<ButtonSize>('l');

  @Input() public readonly kind: ButtonKind = 'primary';
  public readonly kind$: BehaviorSubject<ButtonKind> = new BehaviorSubject<ButtonKind>('primary');

  @Input() public readonly type: ButtonType = 'button';
  public readonly type$: BehaviorSubject<ButtonType> = new BehaviorSubject<ButtonType>('button');

  @Input() public readonly disabled: boolean = false;
  public readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public readonly icon: Nullable<string>;
  public readonly icon$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);

  @Input() public readonly iconPosition: ButtonIconPosition = 'left';
  public readonly iconPosition$: BehaviorSubject<ButtonIconPosition> = new BehaviorSubject<ButtonIconPosition>('left');
  public readonly isReversedDirection$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public readonly loading: boolean = false;
  public readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public readonly active: boolean = false;
  public readonly active$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public readonly tabIndex: string = '0';

  protected commonButtonClasses: Observable<string>[] = [
    this.size$,
    this.kind$,
    this.disabled$.pipe(map((isDisabled: boolean) => (isDisabled ? 'disabled' : null))),
  ];

  public readonly loadingSizePx$: Observable<string> = this.size$.pipe(
    map((size: ButtonSize) => (size === 's' ? '12px' : '16px'))
  );

  public readonly resultClassList$: Observable<string[]> = combineLatest([
    ...this.commonButtonClasses,
    this.active$.pipe(map((isActive: boolean) => (isActive ? 'active' : null))),
  ]).pipe(
    map((classes: string[]) =>
      classes
        .filter((innerClass: string) => !isNil(innerClass))
        .map((innerProperty: string) => `button_${innerProperty}`)
    )
  );

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processSizeChange(changes?.size);
    this.processTypeChange(changes?.type);
    this.processKindChange(changes?.kind);
    this.processDisabledChange(changes?.disabled);
    this.processIconChange(changes?.icon);
    this.processIconPositionChange(changes?.iconPosition);
    this.processLoadingChange(changes?.loading);
    this.processActiveChange(changes?.active);
  }

  @HostListener('pointerup', ['$event'])
  public handleTap(event: Event): void {
    this.disabled$.pipe(take(1), filterTruthy()).subscribe(() => {
      event.stopPropagation();
    });
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

  private processIconChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (typeof updatedValue === 'undefined') {
      return;
    }

    this.icon$.next(updatedValue);
  }

  private processIconPositionChange(change: ComponentChange<this, ButtonIconPosition>): void {
    const updatedValue: ButtonIconPosition | undefined = change?.currentValue;

    if (typeof updatedValue === 'undefined') {
      return;
    }

    this.isReversedDirection$.next(updatedValue === 'right');
  }

  private processLoadingChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.loading$.next(updatedValue);
  }

  private processActiveChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.active$.next(updatedValue);
  }
}
