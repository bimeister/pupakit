import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-select-example-10',
  templateUrl: './example-10.component.html',
  styleUrls: ['./example-10.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectExample10Component {
  public readonly control: FormControl = new FormControl([]);

  public handleTagDelete(tagValue: unknown): void {
    const controlValue: unknown[] = this.control.value;
    const updatedControlValue: unknown[] = controlValue.filter((value: unknown) => value !== tagValue);

    this.control.setValue(updatedControlValue);
  }
}
