import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'demo-loader',
  styleUrls: ['demo-loader.component.scss'],
  templateUrl: './demo-loader.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoLoaderComponent {}
