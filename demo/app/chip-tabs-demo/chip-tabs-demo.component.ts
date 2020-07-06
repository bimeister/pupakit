import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-chip-tabs-demo',
  templateUrl: './chip-tabs-demo.component.html',
  styleUrls: ['./chip-tabs-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipTabsDemoComponent {
  public logLatestClickedTabIndex(index: number): void {
    // tslint:disable-next-line: no-console
    console.log(index);
  }

  public logSelectedTabsIndexes(indexes: number[]): void {
    // tslint:disable-next-line: no-console
    console.log(indexes);
  }
}
