import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pupa-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayComponent {
  @Input() public isVisible: boolean = false;
}
