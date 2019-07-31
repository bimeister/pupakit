import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'demo-loader',
  styleUrls: ['./rating-demo.component.scss'],
  templateUrl: './rating-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingDemoComponent {
  public rating: number = 3;
  public readonly form: FormGroup = new FormGroup({
    rating: new FormControl(this.rating)
  });
}
