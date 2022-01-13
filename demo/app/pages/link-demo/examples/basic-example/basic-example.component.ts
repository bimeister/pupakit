import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-basic-example',
  templateUrl: './basic-example.component.html',
  styleUrls: ['./basic-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class BasicExampleComponent {}
