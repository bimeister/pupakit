import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientUiStateHandlerService } from '@bimeister/pupakit.common';
import { map } from 'rxjs/operators';

const ITEM_HEIGHT_REM: number = 6.25;

@Component({
  selector: 'demo-scrollable-example-2',
  templateUrl: './example-2.component.html',
  styleUrls: ['./example-2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollableExample2Component {
  public readonly virtualScrollItems: number[] = Array.from({ length: 500 }).map(
    (_item: number, index: number) => index
  );

  public readonly itemHeight$: Observable<number> = this.clientUiStateHandlerService.remSizePx$.pipe(
    map((remSizePx: number) => remSizePx * ITEM_HEIGHT_REM)
  );

  constructor(private readonly clientUiStateHandlerService: ClientUiStateHandlerService) {}
}
