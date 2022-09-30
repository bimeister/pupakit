import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-test-drawer',
  templateUrl: './test-drawer.component.html',
  styleUrls: ['./test-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestDrawerComponent {}
