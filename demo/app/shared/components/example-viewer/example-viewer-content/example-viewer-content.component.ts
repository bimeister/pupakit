import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-example-viewer-content',
  templateUrl: './example-viewer-content.component.html',
  styleUrls: ['./example-viewer-content.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleViewerContentComponent {}
