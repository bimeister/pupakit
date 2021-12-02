import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-example-viewer-properties',
  templateUrl: './example-viewer-properties.component.html',
  styleUrls: ['./example-viewer-properties.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleViewerPropertiesComponent {}
