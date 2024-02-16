import { ChangeDetectionStrategy, Component, HostListener, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { filterTruthy, isNil } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ButtonKind } from '../../../../declarations/types/button-kind.type';
import { ButtonSize } from '../../../../declarations/types/button-size.type';
import { ButtonType } from '../../../../declarations/types/button-type.type';

@Component({
  selector: 'pupa-button-icon',
  templateUrl: './button-icon.component.html',
  styleUrls: ['./button-icon.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonIconComponent implements OnChanges {
  @Input() public size: ButtonSize = 'l';
  public readonly size$: BehaviorSubject<ButtonSize> = new BehaviorSubject<ButtonSize>('l');

  @Input() public kind: ButtonKind = 'primary';
  public readonly kind$: BehaviorSubject<ButtonKind> = new BehaviorSubject<ButtonKind>('primary');

  @Input() public type: ButtonType = 'button';
  public readonly type$: BehaviorSubject<ButtonType> = new BehaviorSubject<ButtonType>('button');

  @Input() public disabled: boolean | null = false;
  public readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public icon: string | null = null;
  public readonly icon$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  @Input() public loading: boolean | null = false;
  public readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public active: boolean | null = false;
  public readonly active$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public tabIndex: string = '0';

  public readonly loadingSizePx$: Observable<string> = this.size$.pipe(
    map((size: ButtonSize) => (size === 's' ? '12px' : '16px'))
  );

  public readonly resultClassList$: Observable<string[]> = combineLatest([
    this.size$,
    this.kind$,
    this.disabled$.pipe(map((isDisabled: boolean) => (isDisabled ? 'disabled' : null))),
    this.active$.pipe(map((isActive: boolean) => (isActive ? 'active' : null))),
  ]).pipe(
    map((classes: string[]) =>
      classes
        .filter((innerClass: string) => !isNil(innerClass))
        .map((innerProperty: string) => `pupa-button_${innerProperty}`)
    )
  );

  @HostListener('pointerup', ['$event'])
  public handleTap(event: Event): void {
    this.disabled$.pipe(take(1), filterTruthy()).subscribe(() => {
      event.stopPropagation();
    });
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processSizeChange(changes?.size);
    this.processTypeChange(changes?.type);
    this.processKindChange(changes?.kind);
    this.processDisabledChange(changes?.disabled);
    this.processIconChange(changes?.icon);
    this.processLoadingChange(changes?.loading);
    this.processActiveChange(changes?.active);
  }

  private processSizeChange(change: ComponentChange<this, ButtonSize> | undefined): void {
    const updatedValue: ButtonSize | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.size$.next(updatedValue);
  }

  private processTypeChange(change: ComponentChange<this, ButtonType> | undefined): void {
    const updatedValue: ButtonType | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.type$.next(updatedValue);
  }

  private processKindChange(change: ComponentChange<this, ButtonKind> | undefined): void {
    const updatedValue: ButtonKind | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.kind$.next(updatedValue);
  }

  private processDisabledChange(change: ComponentChange<this, boolean | null> | undefined): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.disabled$.next(updatedValue);
  }

  private processIconChange(change: ComponentChange<this, string | null> | undefined): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (typeof updatedValue === 'undefined') {
      return;
    }

    this.icon$.next(updatedValue);
  }

  private processLoadingChange(change: ComponentChange<this, boolean | null> | undefined): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.loading$.next(updatedValue);
  }

  private processActiveChange(change: ComponentChange<this, boolean | null> | undefined): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.active$.next(updatedValue);
  }
}
