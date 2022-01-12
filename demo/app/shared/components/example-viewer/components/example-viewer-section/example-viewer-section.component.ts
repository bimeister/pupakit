import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-example-viewer-section',
  templateUrl: './example-viewer-section.component.html',
  styleUrls: ['./example-viewer-section.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleViewerSectionComponent {}
