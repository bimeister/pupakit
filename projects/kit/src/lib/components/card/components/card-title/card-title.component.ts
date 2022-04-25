import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CardSize } from '../../../../../internal/declarations/types/card-size.type';
import { CardStateService } from '../../../card/service/card-state.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'pupa-card-title',
  templateUrl: './card-title.component.html',
  styleUrls: ['./card-title.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTitleComponent {
  private readonly size$: BehaviorSubject<CardSize> = this.cardStateService.size$;
  public readonly sizeClass$: Observable<string> = this.size$.pipe(map((size: CardSize) => `card-title_${size}`));

  constructor(private readonly cardStateService: CardStateService) {}
}
