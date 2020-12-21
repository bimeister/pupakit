import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-example-viewer',
  templateUrl: './example-viewer.component.html',
  styleUrls: ['./example-viewer.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleViewerComponent {}
