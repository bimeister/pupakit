import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-example-viewer-section-label',
  templateUrl: './example-viewer-section-label.component.html',
  styleUrls: ['./example-viewer-section-label.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleViewerSectionLabelComponent {}
