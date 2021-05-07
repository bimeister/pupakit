import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Optional,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AbstractControlWithNotifier } from '../../../../../internal/declarations/classes/abstract/abstract-control-with-notifiers.abstract';
import { AbstractControlMethodsKey } from '../../../../../internal/declarations/enums/abstract-control-methods-key.enum';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { OnChangeCallback } from '../../../../../internal/declarations/types/on-change-callback.type';
import { OnTouchedCallback } from '../../../../../internal/declarations/types/on-touched-callback.type';
import { TableInputStateService } from '../../services/table-input-state.service';

@Component({
  selector: 'pupa-table-input',
  templateUrl: './table-input.component.html',
  styleUrls: ['./table-input.component.scss'],
  providers: [TableInputStateService],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableInputComponent<T> extends AbstractControlWithNotifier implements OnChanges, ControlValueAccessor {
  @Input() public readonly placeholder: string = '';

  @Input() public readonly errorTitle: string = '';
  public readonly errorTitle$: BehaviorSubject<string> = new BehaviorSubject('');

  @Input() public readonly hoverIconName: string = 'md-create';
  public readonly hoverIconName$: BehaviorSubject<string> = new BehaviorSubject('md-create');

  @Input() public readonly errorIconName: string = 'md-alert';
  public readonly errorIconName$: BehaviorSubject<string> = new BehaviorSubject('md-alert');

  @Output() public focus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  @Output() public blur: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

  public readonly value$: BehaviorSubject<string> = this.tableInputStateService.currentValue$;
  public readonly isDisabled$: BehaviorSubject<boolean> = this.tableInputStateService.isDisabled$;
  public readonly isValid$: Observable<boolean> = this.tableInputStateService.isValid$;
  public readonly isTouched$: Observable<boolean> = this.tableInputStateService.isTouched$;

  private readonly subscription: Subscription = new Subscription();

  constructor(@Optional() ngControl: NgControl, private readonly tableInputStateService: TableInputStateService<T>) {
    super(ngControl);
    if (isNil(ngControl)) {
      return;
    }
    ngControl.valueAccessor = this;
    this.tableInputStateService.setControlRef(ngControl);
    this.subscription.add(this.setTouched());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (isNil(changes)) {
      return;
    }
    this.processErrorTitleChange(changes?.errorTitle);
    this.processHoverIconNameChange(changes?.hoverIconName);
    this.processErrorIconNameChange(changes?.errorIconName);
  }

  public updateValue(value: T): void {
    this.tableInputStateService.updateValue(value);
  }

  public writeValue(newValue: T): void {
    this.tableInputStateService.setValue(newValue);
  }

  public registerOnChange(onChange: OnChangeCallback<T>): void {
    this.tableInputStateService.defineOnChangeCallback(onChange);
  }

  public setTouched(): Subscription {
    const touchedMethodKeyList: AbstractControlMethodsKey[] = [
      AbstractControlMethodsKey.markAsTouched,
      AbstractControlMethodsKey.markAsUntouched
    ];
    return this.propertyChanges$
      .pipe(
        filter((key: AbstractControlMethodsKey) => touchedMethodKeyList.includes(key)),
        map((key: AbstractControlMethodsKey) => key === AbstractControlMethodsKey.markAsTouched)
      )
      .subscribe((touched: boolean) => this.tableInputStateService.isTouched$.next(touched));
  }

  public registerOnTouched(onTouched: OnTouchedCallback): void {
    this.tableInputStateService.defineOnTouchedCallback(onTouched);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.tableInputStateService.setDisabledState(isDisabled);
  }

  public emitFocusEvent(focusEvent: FocusEvent): void {
    this.focus.emit(focusEvent);
  }

  public emitBlurEvent(blurEvent: FocusEvent): void {
    this.blur.emit(blurEvent);
  }

  private processErrorTitleChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.errorTitle$.next(updatedValue);
  }

  private processHoverIconNameChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.hoverIconName$.next(updatedValue);
  }

  private processErrorIconNameChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.errorIconName$.next(updatedValue);
  }
}
