import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

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
}
