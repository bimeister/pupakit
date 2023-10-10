import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { CalloutService } from '../../services/callout.service';

@Component({
  selector: 'pupa-callout-collapse-button',
  templateUrl: './callout-collapse-button.component.html',
  styleUrls: ['./callout-collapse-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalloutCollapseButtonComponent {
  public readonly isCollapsed$: Observable<boolean> = this.calloutService.isCollapsed$;

  constructor(private readonly calloutService: CalloutService) {}

  public toggleCalloutCollapse(): void {
    this.calloutService.toggleCalloutCollapse();
  }
}
