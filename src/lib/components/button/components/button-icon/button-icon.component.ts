import { ChangeDetectionStrategy, Component, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { filterTruthy, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { ButtonKind } from '../../../../../internal/declarations/types/button-kind.type';
import { ButtonSize } from '../../../../../internal/declarations/types/button-size.type';
import { ButtonType } from '../../../../../internal/declarations/types/button-type.type';

@Component({
  selector: 'pupa-button-icon',
  templateUrl: './button-icon.component.html',
  styleUrls: ['./button-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class ButtonIconComponent {
  @Input() public readonly size: ButtonSize = 'medium';
  public readonly size$: BehaviorSubject<ButtonSize> = new BehaviorSubject<ButtonSize>('medium');

  @Input() public readonly kind: ButtonKind = 'primary';
  public readonly kind$: BehaviorSubject<ButtonKind> = new BehaviorSubject<ButtonKind>('primary');

  @Input() public readonly type: ButtonType = 'submit';
  public readonly type$: BehaviorSubject<ButtonType> = new BehaviorSubject<ButtonType>('submit');

  @Input() public readonly disabled: boolean = false;
  public readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public readonly icon: Nullable<string>;
  public readonly icon$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);

  @Input() public readonly loading: boolean = false;
  public readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public readonly active: boolean = false;
  public readonly active$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly resultClassList$: Observable<string[]> = combineLatest([
    this.size$,
    this.kind$,
    this.disabled$.pipe(map((isDisabled: boolean) => (isDisabled ? 'disabled' : null))),
    this.active$.pipe(map((isActive: boolean) => (isActive ? 'active' : null)))
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
