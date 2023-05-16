import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-required-field',
  templateUrl: './required-field.component.html',
  styleUrls: ['./required-field.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequiredFieldComponent {
  @Input() public isRequired: boolean = true;
}
