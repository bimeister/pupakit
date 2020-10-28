import { ChangeDetectionStrategy, Component, HostListener, Input, Optional, ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { filterNotNil, isEmpty, isNil } from '@meistersoft/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { InputBase } from '../../../../../internal/declarations/classes/abstract/input-base.abstract';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { ValueType } from '../../../../../internal/declarations/types/input-value.type';
import { TimeFormatPipe } from '../../../../../internal/pipes/time-format.pipe';
import { InputDateTimeStateService } from '../../services/input-date-time-state.service';

const MAX_HOURS: number = 23;
const MAX_MINUTES: number = 59;
const MAX_SECONDS: number = 59;

const PLACEHOLDER: string = '00:00:00';

@Component({
  selector: 'pupa-input-time-seconds',
  templateUrl: './input-time-seconds.component.html',
  styleUrls: ['./input-time-seconds.component.scss'],
  providers: [TimeFormatPipe, InputDateTimeStateService],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputTimeSecondsComponent extends InputBase<ValueType> {
  @Input() public readonly isFixedSize: boolean = true;
  public readonly isFixedSize$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public readonly isIconHovered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly valueIsNotEmpty$: Observable<boolean> = this.value$.pipe(map((value: string) => !isEmpty(value)));

  public readonly placeholderPreviewLeft$: Observable<string> = this.value$.pipe(
    map((value: string) => (isEmpty(value) ? '' : `${value}`))
  );

  public readonly placeholderPreviewRight$: Observable<string> = this.value$.pipe(
    map((value: string) => (isEmpty(value) ? PLACEHOLDER : `${PLACEHOLDER.slice(value.length)}`))
  );

  public readonly hours$: Observable<number> = this.value$.pipe(
    map((value: string) => (!isEmpty(value) && value.length >= 2 ? Number(value.slice(0, 2)) : -1)),
    filterNotNil(),
    filter((hours: number) => hours <= MAX_HOURS)
  );

  public readonly minutes$: Observable<number> = this.value$.pipe(
    map((value: string) => (!isEmpty(value) && value.length >= 5 ? Number(value.slice(3, 5)) : -1)),
    filterNotNil(),
    filter((minutes: number) => minutes <= MAX_MINUTES)
  );

  public readonly seconds$: Observable<number> = this.value$.pipe(
    map((value: string) => (!isEmpty(value) && value.length === 8 ? Number(value.slice(6)) : -1)),
    filterNotNil(),
    filter((minutes: number) => minutes <= MAX_SECONDS)
  );

  constructor(
    private readonly inputDateTimeStateService: InputDateTimeStateService,
    @Optional() public readonly ngControl: NgControl
  ) {
    super(ngControl);
  }

  @HostListener('window:click')
  @HostListener('window:touchstart')
  public processWindowClick(): void {
    this.isFocused$.next(false);
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (isNil(changes)) {
      return;
    }
    this.processIsFixedSizeChange(changes?.isFixedSize);
  }

  public setValue(value: ValueType): void {
    const serializedValue: string = isNil(value) ? '' : String(value);
    this.value$.next(serializedValue);
  }

  public selectHours(hours: number): void {
    this.value$.pipe(take(1)).subscribe((value: string) => {
      const parsedHours: string = this.inputDateTimeStateService.getUpdatedValueStringAfterSelectHours(hours, value);
      this.updateValue(parsedHours);
    });
  }

  public selectMinutes(minutes: number): void {
    this.value$.pipe(take(1)).subscribe((value: string) => {
      const parsedMinutes: string = this.inputDateTimeStateService.getUpdatedValueStringAfterSelectMinutes(
        minutes,
        value
      );
      this.updateValue(parsedMinutes);
    });
  }

  public selectSeconds(seconds: number): void {
    this.value$.pipe(take(1)).subscribe((value: string) => {
      const parsedSeconds: string = this.inputDateTimeStateService.getUpdatedValueStringAfterSelectSeconds(
        seconds,
        value
      );
      this.updateValue(parsedSeconds);
    });
  }

  public handleIconHover(isHovered: boolean): void {
    this.isIconHovered$.next(isHovered);
  }

  public clearInputValue(): void {
    combineLatest([this.isIconHovered$, this.valueIsNotEmpty$])
      .pipe(
        take(1),
        filter(([isIconHovered, valueIsNotEmpty]: [boolean, boolean]) => isIconHovered && valueIsNotEmpty)
      )
      .subscribe(() => this.updateValue(''));
  }

  private processIsFixedSizeChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isFixedSize$.next(updatedValue);
  }
}
