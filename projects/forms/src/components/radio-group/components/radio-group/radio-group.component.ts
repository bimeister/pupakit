import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentChanges, ComponentChange } from '@bimeister/pupakit.common';
import { filterTruthy, isEmpty, VOID } from '@bimeister/utilities';
import { Observable, Subscription } from 'rxjs';
import { OnChangeCallback } from '../../../../declarations/types/on-change-callback.type';
import { OnTouchedCallback } from '../../../../declarations/types/on-touched-callback.type';
import { RadioControlSize } from '../../../../declarations/types/radio-control-size.type';
import { RadioGroupDirection } from '../../../../declarations/types/radio-group-direction.type';
import { RadioGroupService } from '../../services/radio-group.service';

@Component({
  selector: 'pupa-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    RadioGroupService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
})
export class RadioGroupComponent<T> implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  @Input() public direction: RadioGroupDirection = 'column';
  @Input() public readonly size: RadioControlSize = 'medium';
  @Input() public readonly disabled: boolean = false;

  private readonly subscription: Subscription = new Subscription();

  public readonly value$: Observable<T> = this.radioGroupService.value$;
  public readonly onTouch$: Observable<boolean> = this.radioGroupService.onTouch$;

  constructor(private readonly radioGroupService: RadioGroupService<T>) {}

  public ngOnInit(): void {
    this.subscription.add(this.triggerCallBackOnChange());
    this.subscription.add(this.triggerCallBackOnTouch());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processLabelSizeChange(changes?.size);
    this.processIsDisabledChange(changes?.disabled);
    this.processDirectionChange(changes?.direction);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public writeValue(value: T): void {
    this.radioGroupService.setValue(value);
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.radioGroupService.setDisabled(isDisabled);
  }

  public onChange: OnChangeCallback<T> = () => VOID;
  public registerOnChange(onChange: OnChangeCallback<T>): void {
    this.onChange = onChange;
  }

  public onTouched: OnTouchedCallback = () => VOID;
  public registerOnTouched(onTouched: OnTouchedCallback): void {
    this.onTouched = onTouched;
  }

  private triggerCallBackOnChange(): Subscription {
    return this.value$.subscribe((value: T) => this.onChange(value));
  }

  private triggerCallBackOnTouch(): Subscription {
    return this.onTouch$.pipe(filterTruthy()).subscribe(() => this.onTouched());
  }

  private processLabelSizeChange(change: ComponentChange<this, RadioControlSize>): void {
    const updatedValue: RadioControlSize | undefined = change?.currentValue;

    if (isEmpty(updatedValue)) {
      return;
    }

    this.radioGroupService.setLabelSize(updatedValue);
  }

  private processIsDisabledChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isEmpty(updatedValue)) {
      return;
    }

    this.radioGroupService.setDisabled(updatedValue);
  }

  private processDirectionChange(change: ComponentChange<this, RadioGroupDirection>): void {
    const updatedValue: RadioGroupDirection | undefined = change?.currentValue;

    if (isEmpty(updatedValue)) {
      return;
    }

    this.radioGroupService.setDirection(updatedValue);
  }
}
