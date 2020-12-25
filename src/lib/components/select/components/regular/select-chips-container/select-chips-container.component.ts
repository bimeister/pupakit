import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-select-chips-container',
  templateUrl: './select-chips-container.component.html',
  styleUrls: ['./select-chips-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectChipsContainerComponent {}
