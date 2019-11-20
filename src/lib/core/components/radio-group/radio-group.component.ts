import { AfterContentInit, Component, ContentChildren, OnInit, QueryList } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { RadioButtonComponent } from '../radio-button/radio-button.component';

type VoidFn = () => void;
type ChangeFn<T> = (value: T) => void;

@Component({
  selector: 'pupa-radio-group',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  template: '<ng-content></ng-content>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RadioGroupComponent,
      multi: true
    }
  ]
})
export class RadioGroupComponent<T> implements OnInit, AfterContentInit, ControlValueAccessor {
  private currentIndex: number;
  @ContentChildren(RadioButtonComponent)
  private readonly radioButtons: QueryList<RadioButtonComponent<T>>;
  private readonly selectedRadioValue: BehaviorSubject<T> = new BehaviorSubject<T>(null);

  public onChange: ChangeFn<T> = (_: T): void => null;
  public onTouched: VoidFn = (): void => null;

  public ngOnInit(): void {
    this.currentIndex = RadioGroupComponent.uniqueIndex++;
  }

  public ngAfterContentInit(): void {
    this.selectedRadioValue.subscribe(selectedValue => {
      this.radioButtons.forEach(item => {
        item.checked = item.value === selectedValue;
      });
    });

    this.initializeRadioGroup();
  }

  private initializeRadioGroup(): void {
    let groupHasSelectedButton: boolean = false;

    this.radioButtons.forEach(item => {
      item.registerOnChange(checked => {
        if (checked) {
          this.writeValue(item.value);
          this.onChange(item.value);
        }
      });

      item.name = this.currentIndex.toString();
      groupHasSelectedButton = groupHasSelectedButton || item.checked;
    });

    if (!groupHasSelectedButton && this.radioButtons.length > 0) {
      this.writeValue(this.radioButtons.first.value);
    }
  }

  public registerOnChange(fn: ChangeFn<T>): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: VoidFn): void {
    this.onTouched = fn;
  }

  public writeValue(value: T): void {
    this.selectedRadioValue.next(value);
  }

  private static uniqueIndex: number = 0;
}
