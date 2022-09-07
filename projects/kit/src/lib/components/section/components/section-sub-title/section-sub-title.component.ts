import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-section-sub-title',
  templateUrl: './section-sub-title.component.html',
  styleUrls: ['./section-sub-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class SectionSubTitleComponent {}
