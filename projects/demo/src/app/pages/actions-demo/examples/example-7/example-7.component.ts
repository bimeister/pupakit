import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-actions-example-7',
  templateUrl: './example-7.component.html',
  styleUrls: ['./example-7.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsExample7Component {
  public readonly actions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  public readonly pupaActionTemplateIsDividerShown: (action: number) => boolean = (action: number) => action % 2 === 0;
}
