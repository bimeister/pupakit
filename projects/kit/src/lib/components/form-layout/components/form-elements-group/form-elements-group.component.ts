import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-form-elements-group',
  templateUrl: './form-elements-group.component.html',
  styleUrls: ['./form-elements-group.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormElementsGroupComponent {}
