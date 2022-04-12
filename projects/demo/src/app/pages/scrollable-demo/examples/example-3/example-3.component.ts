import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'demo-scrollable-example-3',
  templateUrl: './example-3.component.html',
  styleUrls: ['./example-3.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollableExample3Component implements OnInit {
  public contentWidth$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public contentHeight$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public ngOnInit(): void {
    this.changeContent();
  }

  public changeContent(): void {
    const randomWidth: number = Math.random() * 1_000;
    const randomHeight: number = Math.random() * 1_000;

    this.contentWidth$.next(randomWidth);
    this.contentHeight$.next(randomHeight);
  }
}
