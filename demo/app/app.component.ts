import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class AppComponent {}
