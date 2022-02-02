import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-select-example-11',
  templateUrl: './example-11.component.html',
  styleUrls: ['./example-11.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectExample11Component {
  public readonly controlTag: FormControl = new FormControl(['Option 3']);

  public handleControlTagReset(): void {
    this.controlTag.reset([]);
  }
}
