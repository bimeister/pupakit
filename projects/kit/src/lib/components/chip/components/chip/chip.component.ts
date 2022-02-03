import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { filterTruthy, isNil } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ChipColors } from '../../../../../internal/declarations/enums/chip-colors.enum';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';

@Component({
  selector: 'pupa-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent implements OnChanges {
  @Input() public color: ChipColors = ChipColors.Light;
  @Input() public isDisabled: boolean = false;

  public readonly color$: BehaviorSubject<ChipColors> = new BehaviorSubject<ChipColors>(ChipColors.Light);
  public readonly isDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isHovered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processColorChanges(changes.color);
    this.processDisabledChanges(changes.isDisabled);
  }

  public chipClick(event: Event): void {
    this.isDisabled$.pipe(take(1), filterTruthy()).subscribe(() => {
      event.stopPropagation();
    });
  }

  public handleHover(isHovered: boolean): void {
    this.isHovered$.next(isHovered);
  }

  private processColorChanges(change: ComponentChange<this, ChipColors>): void {
    const newValue: ChipColors | undefined = change?.currentValue;

    if (isNil(newValue)) {
      return;
    }
    this.color$.next(newValue);
  }

  private processDisabledChanges(change: ComponentChange<this, boolean>): void {
    const newValue: boolean | undefined = change?.currentValue;

    if (isNil(newValue)) {
      return;
    }
    this.isDisabled$.next(newValue);
  }
}
