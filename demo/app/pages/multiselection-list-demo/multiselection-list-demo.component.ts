import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-multiselection-list-demo',
  templateUrl: './multiselection-list-demo.component.html',
  styleUrls: ['./multiselection-list-demo.component.scss']
})
export class MultiselectionListDemoComponent {
  public readonly values: string[] = ['1', '2', '3', '4', '5'];
  public readonly controlValue: string[] = ['4', '5'];

  public readonly formControl: FormControl = new FormControl(this.controlValue);
  public output: string[] = [];

  public isSelectedInFormControl(value: string): boolean {
    const selectedValues: string[] = this.formControl.value;
    return selectedValues.includes(value);
  }

  public isSelected(value: string): boolean {
    return this.output.includes(value);
  }

  public changeHandler(value: string[]): void {
    this.output = value;
  }
}
