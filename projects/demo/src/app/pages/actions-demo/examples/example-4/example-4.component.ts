import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

const NAMES: string[] = [
  'app-admin',
  'app-aim',
  'app-apps',
  'app-calendar',
  'app-card-view',
  'app-clipboard',
  'app-clock',
  'app-create',
  'app-doc',
  'app-cube',
];

@Component({
  selector: 'demo-actions-example-4',
  templateUrl: './example-4.component.html',
  styleUrls: ['./example-4.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsExample4Component {
  public readonly actions: string[] = NAMES;
}
