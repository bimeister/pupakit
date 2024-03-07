import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-actions-example-8',
  templateUrl: './example-8.component.html',
  styleUrls: ['./example-8.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsExample8Component {
  public readonly actions: number[] = [1, 2, 3, 4, 5];
}
