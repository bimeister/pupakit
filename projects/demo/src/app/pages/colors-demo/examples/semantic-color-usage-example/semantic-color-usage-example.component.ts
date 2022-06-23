import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-semantic-color-usage-example',
  templateUrl: './semantic-color-usage-example.component.html',
  styleUrls: ['./semantic-color-usage-example.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorsSemanticColorUsageExampleComponent {}
