import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CalloutService } from '../../services/callout.service';

@Component({
  selector: 'pupa-callout-header',
  templateUrl: './callout-header.component.html',
  styleUrls: ['./callout-header.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalloutHeaderComponent implements OnInit {
  constructor(private readonly calloutService: CalloutService) {}

  public ngOnInit(): void {
    this.calloutService.setHasHeaderToTrue();
  }
}
