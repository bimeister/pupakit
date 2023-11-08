import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-hotkeys',
  templateUrl: './hotkeys.component.html',
  styleUrls: ['./hotkeys.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotkeysComponent {}
