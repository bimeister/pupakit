import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CalloutService } from '../../services/callout.service';

@Component({
  selector: 'pupa-callout-close-button',
  templateUrl: './callout-close-button.component.html',
  styleUrls: ['./callout-close-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalloutCloseButtonComponent {
  constructor(private readonly calloutService: CalloutService) {}

  public closeCallout(): void {
    this.calloutService.closeCallout();
  }
}
