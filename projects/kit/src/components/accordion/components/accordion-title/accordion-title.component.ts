import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-accordion-title',
  templateUrl: './accordion-title.component.html',
  styleUrls: ['./accordion-title.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionTitleComponent {}
