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
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { filterTruthy, isEmpty, isNil, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { SelectStateService } from '../../services/select-state.service';
import { SelectTriggerBase } from '../../../../declarations/classes/abstract/select-trigger-base.abstract';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';

/**
 * @deprecated need support new design
 */
@Component({
  selector: 'pupa-select-trigger-input',
  templateUrl: './select-trigger-input.component.html',
  styleUrls: ['./select-trigger-input.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectTriggerInputComponent<T> extends SelectTriggerBase<T> implements OnDestroy, OnChanges {
  @ViewChild('overlayOrigin', { static: true }) protected readonly overlayOrigin: CdkOverlayOrigin;
  @ViewChild('button', { static: true }) protected readonly button: ElementRef<HTMLElement>;

  @ViewChild('inputElement', { static: false }) public readonly inputElement: ElementRef<HTMLInputElement>;

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
    this.subscription.add(this.processDisableState());
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

  private processDisableState(): Subscription {
    return this.selectStateService.isDisabled$.subscribe((isDisabled: boolean) => {
      if (isDisabled) {
        this.control.disable();

        return;
      }

      this.control.enable();
    });
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
