import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { filterFalsy, isNil } from '@bimeister/utilities';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { remSizePx } from '../../../../../internal/constants/rem-size-px.const';
import { ControlState } from '../../../../../internal/declarations/enums/control-state.enum';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { SearchFieldKind } from '../../../../../internal/declarations/types/search-field-kind.type';

@Component({
  selector: 'pupa-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('controlExpanded', [
      state('false', style({ width: `${11.25 * remSizePx}px` })),
      state('true', style({ width: `100%` })),
      transition('false => true', animate('0.32s cubic-bezier(0.97, 0.84, .03, 0.95)')),
      transition('true => false', animate('0.2s ease-in-out'))
    ])
  ]
})
export class SearchFieldComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('inputElement', { static: true }) public inputElement: ElementRef<HTMLInputElement>;
  public controlExpansionState$: BehaviorSubject<ControlState> = new BehaviorSubject<ControlState>(
    ControlState.collapsed
  );
  @Input() public placeholder: string = '';
  @Input() public expandable: boolean = false;
  @Input() public disabled: boolean = false;
  public readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Input() public kind: SearchFieldKind = 'solid';
  @Input()
  public get value(): string {
    return this.isValueEmpty ? '' : this.inputValueControl.value;
  }
  public set value(newValue: string) {
    this.inputValueControl.setValue(newValue);
  }
  @Input() public clearValue: Subject<void> = new Subject<void>();
  @Input() public collapsedField: Subject<void> = new Subject<void>();
  @Output() public valueChange: EventEmitter<string> = new EventEmitter<string>();
  @HostBinding('class.pupa-search-field_expandable')
  public get isExpandable(): boolean {
    return this.expandable;
  }
  public inputValueControl: FormControl = new FormControl(null);

  public get buttonIconName(): string {
    if (this.expandable) {
      return this.controlExpansionState$.getValue() === ControlState.expanded ? 'close' : 'search';
    }
    return !this.isValueEmpty ? 'close' : 'search';
  }

  public get isValueEmpty(): boolean {
    return isNil(this.inputValueControl.value) || String(this.inputValueControl.value).length === 0;
  }

  private readonly subscription: Subscription = new Subscription();

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processDisabledChange(changes?.disabled);
  }

  public ngOnInit(): void {
    this.subscription
      .add(this.inputValueControl.valueChanges.subscribe((value: string) => this.valueChange.emit(value)))
      .add(this.clearValue.subscribe(() => (this.value = '')))
      .add(
        this.collapsedField.subscribe(() => {
          this.clearValue.next();
          this.collapse();
        })
      );
    this.subscription.add(this.toggleFormControlDisabling());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public switchState(event: Event): void {
    event.stopPropagation();
    switch (this.expandable) {
      case true: {
        this.collapse();
        return;
      }
      case false: {
        if (!this.isValueEmpty) {
          this.inputValueControl.reset();
          this.inputElement.nativeElement.blur();
          return;
        }
        this.inputElement.nativeElement.focus();
        return;
      }
      default: {
        return;
      }
    }
  }

  private toggleFormControlDisabling(): Subscription {
    return this.disabled$.subscribe((disabled: boolean) =>
      disabled ? this.inputValueControl.disable() : this.inputValueControl.enable()
    );
  }

  private processDisabledChange(change: ComponentChange<this, boolean>): void {
    const disabled: boolean | undefined = change?.currentValue;

    if (isNil(disabled)) {
      return;
    }

    this.disabled$.next(disabled);
  }

  private collapse(): void {
    this.disabled$.pipe(take(1), filterFalsy()).subscribe(() => {
      const currentValue: ControlState = this.controlExpansionState$.getValue();
      if (currentValue === ControlState.expanded) {
        this.inputElement.nativeElement.blur();
        this.controlExpansionState$.next(ControlState.collapsed);
        this.inputValueControl.reset();
        return;
      }
      this.controlExpansionState$.next(ControlState.expanded);
      this.inputElement.nativeElement.focus();
    });
  }
}
