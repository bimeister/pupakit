import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-tag-text',
  templateUrl: './pupa-tag-text.component.html',
  styleUrls: ['./pupa-tag-text.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagTextComponent {}
