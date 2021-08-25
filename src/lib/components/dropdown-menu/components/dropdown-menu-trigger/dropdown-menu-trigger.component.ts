import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { take } from 'rxjs/operators';
import { DropdownService } from '../../services/dropdown.service';

@Component({
  selector: 'pupa-dropdown-menu-trigger',
  templateUrl: './dropdown-menu-trigger.component.html',
  styleUrls: ['./dropdown-menu-trigger.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownMenuTriggerComponent {
  @ViewChild('overlayOrigin', { static: true }) protected readonly overlayOrigin: CdkOverlayOrigin;

  constructor(private readonly dropdownService: DropdownService) {}

  public ngOnInit(): void {
    this.registerDropdownTrigger();
  }

  public toggle(): void {
    this.dropdownService.isOpened$
      .pipe(take(1))
      .subscribe((isOpened: boolean) => this.dropdownService.setOpened(!isOpened));
  }

  private registerDropdownTrigger(): void {
    this.dropdownService.registerTooltipOverlayOrigin(this.overlayOrigin);
  }
}
