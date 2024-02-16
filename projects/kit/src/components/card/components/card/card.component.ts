import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { CardSize } from '../../../../declarations/types/card-size.type';
import { CardStateService } from '../../service/card-state.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';

@Component({
  selector: 'pupa-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CardStateService],
})
export class CardComponent implements OnChanges {
  @Input() public size: CardSize = 'large';
  private readonly size$: Observable<CardSize> = this.cardStateService.size$.asObservable();
  public readonly sizeClass$: Observable<string> = this.size$.pipe(map((size: CardSize) => `pupa-card_${size}`));

  @Input() public disabled: boolean = false;
  public readonly disabled$: Observable<boolean> = this.cardStateService.disabled$.asObservable();

  @Input() public clickable: boolean = false;
  public readonly clickable$: Observable<boolean> = this.cardStateService.clickable$.asObservable();

  @Input() public selected: boolean = false;
  public readonly selected$: Observable<boolean> = this.cardStateService.selected$.asObservable();

  @Input() public tabIndex: number = 0;

  constructor(private readonly cardStateService: CardStateService) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processDisabledChange(changes?.disabled);
    this.processSizeChange(changes?.size);
    this.processClickableChange(changes?.clickable);
    this.processSelectedChange(changes?.selected);
  }

  private processDisabledChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.cardStateService.setDisabledState(updatedValue);
  }

  private processSizeChange(change: ComponentChange<this, CardSize>): void {
    const updatedValue: CardSize | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.cardStateService.setSize(updatedValue);
  }

  private processClickableChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.cardStateService.setClickableState(updatedValue);
  }

  private processSelectedChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.cardStateService.setSelectedState(updatedValue);
  }
}
