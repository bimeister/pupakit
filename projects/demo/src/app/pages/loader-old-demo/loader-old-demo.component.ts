import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-loader-old-demo',
  styleUrls: ['../demo.scss'],
  templateUrl: './loader-old-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderOldDemoComponent {}
