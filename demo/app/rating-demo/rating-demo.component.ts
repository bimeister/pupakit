import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-loader',
  styleUrls: ['./rating-demo.component.scss'],
  templateUrl: './rating-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingDemoComponent {
  public rating: number = 3;
}
