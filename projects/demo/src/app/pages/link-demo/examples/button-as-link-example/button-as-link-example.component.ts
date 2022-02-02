import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-button-as-link-example',
  templateUrl: './button-as-link-example.component.html',
  styleUrls: ['./button-as-link-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ButtonAsLinkExampleComponent {}
