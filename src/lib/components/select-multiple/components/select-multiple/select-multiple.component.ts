import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { distinctUntilSerializedChanged, isNil } from '@meistersoft/utilities';
import { Observable, Subscription } from 'rxjs';
import { filter, map, shareReplay, startWith } from 'rxjs/operators';

import { SelectOption } from '../../../../../internal/declarations/interfaces/select-option.interface';
import { MultiselectionListComponent } from '../../../multiselection-list/components/multiselection-list/multiselection-list.component';

const SELECTED_OPTION_CHIP_MARGIN_RIGHT_PX: number = 2;

@Component({
  selector: 'pupa-select-multiple',
  templateUrl: './select-multiple.component.html',
  styleUrls: ['./select-multiple.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectMultipleComponent),
      multi: true
    }
  ]
})
export class SelectMultipleComponent implements AfterViewChecked, ControlValueAccessor {
  @ViewChild('selectedOptions') public selectedOptionsRef: ElementRef<HTMLElement>;
  @ViewChild(MultiselectionListComponent) public multiselectionList: MultiselectionListComponent;

  @Input() public options: SelectOption[] = [];
  @Input() public hasBackdrop: boolean = false;

  public readonly multiselectionListControl: FormControl = new FormControl([]);

  public readonly selectedValues$: Observable<string[]> = this.multiselectionListControl.valueChanges.pipe(
    startWith([]),
    shareReplay(1)
  );

  public allSelected$: Observable<boolean> = this.selectedValues$.pipe(
    map((selectedValues: string[]) => selectedValues.length === this.options.length)
  );

  public readonly selectedOptions$: Observable<SelectOption[]> = this.selectedValues$.pipe(
    map((selectedValues: string[]) =>
      selectedValues.map((selectedValue: string) =>
        this.options.find((option: SelectOption) => option.value === selectedValue)
      )
    )
  );

  public overflowSelectedOptionsCount: number = 0;

  public onChange: (selectedValues: string[]) => void;
  public onTouched: () => void;

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
    this.subscription.add(this.handleMultiselectionListControlValueChanges());
  }

  public ngAfterViewChecked(): void {
    this.checkOwerflowSelectedOptions();
  }

  public writeValue(selectedValues: string[]): void {
    this.multiselectionListControl.setValue(selectedValues);
    requestAnimationFrame(() => this.changeDetectorRef.markForCheck());
  }

  public registerOnChange(fn: (selectedValues: string[]) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public selectAll(): void {
    const values: string[] = this.options.map((option: SelectOption) => option.value);
    this.multiselectionListControl.setValue(values);
  }

  public toggleValue(value: string): void {
    this.multiselectionList.toggleValue(value);
  }

  public isSelected(value: string): Observable<boolean> {
    return this.selectedValues$.pipe(map((selectedOptions: string[]) => selectedOptions.includes(value)));
  }

  private handleMultiselectionListControlValueChanges(): Subscription {
    return this.multiselectionListControl.valueChanges
      .pipe(
        filter(() => !isNil(this.onChange)),
        distinctUntilSerializedChanged()
      )
      .subscribe((value: string[]) => this.onChange(value));
  }

  private checkOwerflowSelectedOptions(): void {
    requestAnimationFrame(() => {
      const containerElement: HTMLElement = this.selectedOptionsRef.nativeElement;
      const containerWidthPx: number = containerElement.clientWidth;

      const optionElements: Element[] = Array.from(containerElement.children);

      let commonWidthPx: number = 0;
      let index: number = 0;
      for (const optionElement of optionElements) {
        commonWidthPx += optionElement.clientWidth + SELECTED_OPTION_CHIP_MARGIN_RIGHT_PX;
        if (index > 0 && commonWidthPx > containerWidthPx) {
          this.setOverflowSelectedOptionsCount(optionElements.length - index);
          return;
        }

        index++;
      }
      this.setOverflowSelectedOptionsCount(0);
    });
  }

  private setOverflowSelectedOptionsCount(overflowSelectedOptionsCount: number): void {
    if (this.overflowSelectedOptionsCount === overflowSelectedOptionsCount) {
      return;
    }
    this.overflowSelectedOptionsCount = overflowSelectedOptionsCount;
    this.changeDetectorRef.detectChanges();
  }
}
