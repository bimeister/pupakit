import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { filterFalsy, isEmpty, isNil } from '@bimeister/utilities';
import { Optional } from 'ag-grid-community';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, switchMapTo, take } from 'rxjs/operators';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { CheckboxServiceService } from '../../services/checkbox-service.service';

@Component({
  selector: 'pupa-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent implements ControlValueAccessor, AfterViewInit, OnChanges, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  public readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly value$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly indeterminate$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly resultClassList$: Observable<string[]> = combineLatest([
    this.disabled$,
    this.value$,
    this.indeterminate$
  ]).pipe(
    map(([disabled, value, indeterminate]: [boolean, boolean, boolean]) => {
      const disabledStateClass: string = disabled ? 'checkbox_disabled' : null;
      const hasMarkerClass: string = value || indeterminate ? 'checkbox_with-marker' : null;
      return [disabledStateClass, hasMarkerClass].filter((innerClassName: string) => !isNil(innerClassName));
    })
  );

  @ViewChild('labelElement', { static: true }) public labelElement: ElementRef<HTMLDivElement>;
  @Input() public disabled: boolean = false;
  @Input() public indeterminate: boolean = false;
  @Input() public value: boolean;

  public get isLabelEmpty(): boolean {
    const htmlDivElement: HTMLDivElement | undefined = this.labelElement.nativeElement;
    if (isNil(htmlDivElement)) {
      return true;
    }

    return isEmpty(htmlDivElement?.innerText?.trim());
  }

  constructor(
    @Optional() protected readonly ngControl: NgControl,
    private readonly checkboxServiceService: CheckboxServiceService
  ) {
    if (isNil(ngControl)) {
      return;
    }
    ngControl.valueAccessor = this;
  }

  public ngAfterViewInit(): void {
    this.subscription.add(this.processChangeValue());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.handleIndeterminateChanges(changes?.indeterminate);
    this.handleDisabledChanges(changes?.disabled);
    this.handleValueChanges(changes?.value);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public registerOnChange(onChangeCallback: VoidFunction): void {
    this.onChange = onChangeCallback;
  }

  public registerOnTouched(onTouchedCallback: VoidFunction): void {
    this.onTouched = onTouchedCallback;
  }

  public writeValue(value: boolean): void {
    this.value$.next(value);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled$.next(isDisabled);
  }

  public changeValue(event?: MouseEvent): void {
    event?.stopPropagation();
    this.disabled$
      .pipe(
        take(1),
        filterFalsy(),
        switchMapTo(this.value$),
        take(1),
        map((value: boolean) => !value)
      )
      .subscribe((value: boolean) => {
        this.value$.next(value);
        this.indeterminate$.next(false);
        this.onTouched();
        this.onChange(value);
      });
  }

  public onChange: CallableFunction = (_innerValue: string) => {
    return;
  };

  public onTouched: VoidFunction = () => {
    return;
  };

  private handleValueChanges(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.value$.next(updatedValue);
  }

  private handleIndeterminateChanges(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.indeterminate$.next(updatedValue);
  }

  private handleDisabledChanges(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.disabled$.next(updatedValue);
  }

  private processChangeValue(): Subscription {
    return this.checkboxServiceService.changeValue$.subscribe(() => this.changeValue());
  }
}
