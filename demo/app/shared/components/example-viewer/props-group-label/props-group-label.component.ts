import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-props-group-label',
  templateUrl: './props-group-label.component.html',
  styleUrls: ['./props-group-label.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropsGroupLabelComponent {}
