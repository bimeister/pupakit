import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { filterTruthy, isEmpty, isNil, Nullable } from '@bimeister/utilities';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { CheckboxLabelSize } from '../../../../declarations/types/checkbox-label-size.type';
import { CheckboxService } from '../../services/checkbox.service';

@Component({
  selector: 'pupa-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    CheckboxService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent implements ControlValueAccessor, OnChanges, AfterViewInit {
  @ViewChild('contentLabelWrapper') private readonly contentLabelWrapper: ElementRef<HTMLDivElement>;

  @Input() public disabled: boolean | null = null;
  @Input() public hovered: boolean | null = null;
  @Input() public indeterminate: boolean | null = null;
  @Input() public value: boolean | null = null;
  @Input() public error: boolean | null = null;
  @Input() public size: CheckboxLabelSize = 'medium';
  @Input() public externalValuesControl: boolean | null = null;

  @Output() public readonly valueChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  public readonly disabled$: Observable<boolean> = this.checkboxService.disabled$;
  public readonly externalValuesControl$: Observable<boolean> = this.checkboxService.externalValuesControl$;
  public readonly hovered$: Observable<boolean> = this.checkboxService.hovered$;
  public readonly value$: Observable<boolean> = this.checkboxService.value$;
  public readonly indeterminate$: Observable<boolean> = this.checkboxService.indeterminate$;
  public readonly error$: Observable<boolean> = this.checkboxService.error$;
  public readonly withLabel$: Observable<boolean> = this.checkboxService.withLabel$;
  public readonly size$: Observable<CheckboxLabelSize> = this.checkboxService.size$;

  public readonly checkboxTabindex$: Observable<number> = this.withLabel$.pipe(
    map((withLabel: boolean) => (withLabel ? 1 : -1))
  );
  public readonly checkboxMarkerTabindex$: Observable<number> = this.withLabel$.pipe(
    map((withLabel: boolean) => (withLabel ? -1 : 1))
  );
  public readonly checkBoxDataMeta$: Observable<string> = combineLatest([this.indeterminate$, this.value$]).pipe(
    map(([isIndeterminate, isHasValue]: [boolean, boolean]) => {
      if (isIndeterminate) {
        return 'indeterminate';
      }

      return isHasValue ? 'checked' : 'default';
    })
  );

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly checkboxService: CheckboxService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.subscription.add(this.processSetIndeterminate());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.handleIndeterminateChanges(changes?.indeterminate);
    this.handleDisabledChanges(changes?.disabled);
    this.handleValueChanges(changes?.value);
    this.handleErrorChanges(changes?.error);
    this.handleSizeChanges(changes?.size);
    this.handleHoveredChanges(changes?.hovered);
    this.handleExternalValuesControlChanges(changes?.externalValuesControl);
  }

  public ngAfterViewInit(): void {
    this.handleLabelUpdate();
  }

  public changeValue(): void {
    combineLatest([this.disabled$, this.externalValuesControl$])
      .pipe(
        take(1),
        filter(([disabled, externalValuesControl]: [boolean, boolean]) => !disabled && !externalValuesControl),
        switchMap(() => this.value$),
        take(1),
        map((value: boolean) => !value)
      )
      .subscribe((value: boolean) => {
        this.valueChanged.emit(value);
        this.checkboxService.setValue(value);
        this.checkboxService.setIndeterminate(false);
        this.onTouched();
        this.onChange(value);
      });
  }

  public registerOnChange(onChangeCallback: VoidFunction): void {
    this.onChange = onChangeCallback;
  }

  public registerOnTouched(onTouchedCallback: VoidFunction): void {
    this.onTouched = onTouchedCallback;
  }

  public writeValue(value: boolean): void {
    this.checkboxService.setValue(value);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.checkboxService.setDisabled(isDisabled);
  }

  public onChange: CallableFunction = (_innerValue: string) => {
    // not implemented
  };

  public onTouched: VoidFunction = () => {
    // not implemented
  };

  private handleValueChanges(change: ComponentChange<this, boolean> | undefined): void {
    const updatedValue: Nullable<boolean> = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.checkboxService.setValue(updatedValue);
  }

  private handleErrorChanges(change: ComponentChange<this, boolean> | undefined): void {
    const updatedValue: Nullable<boolean> = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.checkboxService.setError(updatedValue);
  }

  private handleIndeterminateChanges(change: ComponentChange<this, boolean> | undefined): void {
    const updatedValue: Nullable<boolean> = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.checkboxService.setIndeterminate(updatedValue);
  }

  private handleDisabledChanges(change: ComponentChange<this, boolean> | undefined): void {
    const updatedValue: Nullable<boolean> = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.checkboxService.setDisabled(updatedValue);
  }

  private handleHoveredChanges(change: ComponentChange<this, boolean> | undefined): void {
    const updatedValue: Nullable<boolean> = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.checkboxService.setHovered(updatedValue);
  }

  private handleExternalValuesControlChanges(change: ComponentChange<this, boolean> | undefined): void {
    const updatedValue: Nullable<boolean> = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.checkboxService.setExternalValuesControl(updatedValue);
  }

  private handleSizeChanges(change: ComponentChange<this, CheckboxLabelSize> | undefined): void {
    const updatedValue: Nullable<CheckboxLabelSize> = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.checkboxService.setSize(updatedValue);
  }

  private processSetIndeterminate(): Subscription {
    return this.indeterminate$.pipe(filterTruthy()).subscribe(() => this.checkboxService.setValue(null));
  }

  private handleLabelUpdate(): void {
    const hasLabel: boolean = !isEmpty(this.contentLabelWrapper?.nativeElement?.childNodes);
    this.checkboxService.setWithLabel(hasLabel);
    this.changeDetectorRef.detectChanges();
  }
}
