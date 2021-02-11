import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, filter } from 'rxjs/operators';

const ROWS_COUNT: number = 1000;
const DATA: number[] = Array(ROWS_COUNT).fill(null);

const ITEM_SIZE_PX: number = 35;

const DEFAULT_SLICE: number = 50;

@Component({
  selector: 'demo-paged-virtual-scroll-demo',
  templateUrl: './paged-virtual-scroll-demo.component.html',
  styleUrls: ['./paged-virtual-scroll-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class PagedVirtualScrollDemoComponent implements OnInit {
  public readonly itemSize: number = ITEM_SIZE_PX;
  public readonly totalCount: number = ROWS_COUNT;

  public readonly rows$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  public ngOnInit(): void {
    this.getFirstSlice();
  }

  public handleChangeDataSource(): void {
    this.rows$
      .pipe(
        take(1),
        map((rows: number[]) => rows.length),
        filter((currentRowsLength: number) => currentRowsLength <= ROWS_COUNT)
      )
      .subscribe((currentRowsLength: number) => this.rows$.next(DATA.slice(0, currentRowsLength + DEFAULT_SLICE)));
  }

  private getFirstSlice(): void {
    this.rows$.next(DATA.slice(0, DEFAULT_SLICE));
  }
}
