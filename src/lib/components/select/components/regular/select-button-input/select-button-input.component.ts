import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { isEmpty, isNil } from '@bimeister/utilities/commonjs/common';
import { filterTruthy, shareReplayWithRefCount } from '@bimeister/utilities/commonjs/rxjs';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { ComponentChange } from '../../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../../internal/declarations/interfaces/component-changes.interface';
import { SelectStateService } from '../../../services/select-state.service';
import { SelectButtonBase } from './../../../../../../internal/declarations/classes/abstract/select-button-base.abstract';

@Component({
  selector: 'pupa-select-button-input',
  templateUrl: './select-button-input.component.html',
  styleUrls: ['./select-button-input.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectButtonInputComponent<T> extends SelectButtonBase<T> implements OnDestroy, OnChanges {
  @ViewChild('overlayOrigin', { static: true }) protected readonly overlayOrigin: CdkOverlayOrigin;
  @ViewChild('button', { static: true }) protected readonly button: ElementRef<HTMLButtonElement>;

  @ViewChild('inputElement', { static: false }) public readonly inputElement: ElementRef<HTMLInputElement>;

  @Input() public transparent: boolean = false;

  @Input() public placeholder: string = '';

  @Input() public selectedValuePreview: string = '';
  private readonly selectedValuePreview$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public readonly selectedValuePreviewIsEmpty$: Observable<boolean> = this.selectedValuePreview$.pipe(map(isEmpty));

  @Output() public readonly query: EventEmitter<string> = new EventEmitter<string>();

  public readonly control: FormControl = new FormControl('');

  public readonly query$: Observable<string> = this.control.valueChanges.pipe(startWith(''), shareReplayWithRefCount());

  private readonly subscription: Subscription = new Subscription();

  constructor(protected readonly selectStateService: SelectStateService<T>) {
    super(selectStateService);

    this.processFocusButtonInputContainer();
    this.subscription.add(this.processInput());
  }

  public processDomEvent(event: Event): void {
    event.stopPropagation();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processSelectedValuePreviewChange(changes?.selectedValuePreview);
  }

  public resetQuery(event: Event): void {
    this.processDomEvent(event);
    this.control.setValue('');
  }

  private processInput(): Subscription {
    return this.query$.subscribe((query: string) => this.query.emit(query));
  }

  private processFocusButtonInputContainer(): void {
    this.isContentInit$
      .pipe(filterTruthy(), take(1))
      .subscribe(() => this.selectStateService.processFocusInputContainer(this.inputElement));
  }

  private processSelectedValuePreviewChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.selectedValuePreview$.next(updatedValue);
    this.control.setValue(updatedValue);
  }
}
