import { ChangeDetectionStrategy, Component, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { filterFalsy, shareReplayWithRefCount } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, take } from 'rxjs/operators';
import { RadioControlSize } from '../../../../../internal/declarations/types/radio-control-size.type';
import { RadioGroupDirection } from '../../../../../internal/declarations/types/radio-group-direction.type';
import { RadioGroupService } from '../../services/radio-group.service';

/** @dynamic */
@Component({
  selector: 'pupa-radio-control',
  templateUrl: './radio-control.component.html',
  styleUrls: ['./radio-control.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioControlComponent<T> {
  @Input() private readonly value: T;
  @Input() public tabindex: number = 0;

  public readonly labelSize$: Observable<RadioControlSize> = this.radioGroupService.labelSize$;

  public readonly isSelected$: Observable<boolean> = this.radioGroupService.value$.pipe(
    distinctUntilChanged(),
    map((groupControlValue: T) => groupControlValue === this.value),
    shareReplayWithRefCount()
  );

  public readonly isDisabled$: Observable<boolean> = this.radioGroupService.isDisabled$;

  public readonly directions$: Observable<RadioGroupDirection> = this.radioGroupService.direction$;

  constructor(private readonly radioGroupService: RadioGroupService<T>) {}

  @HostListener('click')
  public processClick(): void {
    this.radioGroupService.isDisabled$.pipe(take(1), filterFalsy()).subscribe(() => {
      this.select();
      this.setOnTouch();
    });
  }

  private select(): void {
    this.radioGroupService.setValue(this.value);
  }

  private setOnTouch(): void {
    this.radioGroupService.setOnTouch(true);
  }
}
