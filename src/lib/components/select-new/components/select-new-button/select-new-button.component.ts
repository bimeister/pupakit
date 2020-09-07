import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';

import { SelectNewStateService } from '../../services/select-new-state.service';

@Component({
  selector: 'pupa-select-new-button',
  templateUrl: './select-new-button.component.html',
  styleUrls: ['./select-new-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectNewButtonComponent<T> implements OnInit {
  @ViewChild('overlayOrigin', { static: true }) private readonly overlayOrigin: CdkOverlayOrigin;
  @ViewChild('button', { static: true }) private readonly button: ElementRef<HTMLButtonElement>;

  public readonly isExpanded$: Observable<boolean> = this.selectNewStateService.isExpanded$;
  public readonly isDisabled$: Observable<boolean> = this.selectNewStateService.isDisabled$;

  constructor(private readonly selectNewStateService: SelectNewStateService<T>) {}

  public ngOnInit(): void {
    this.defineDropdownTrigger();
  }

  public processButtonClick(): void {
    this.selectNewStateService.toggleExpansion();
  }

  private defineDropdownTrigger(): void {
    this.selectNewStateService.defineDropdownTrigger(this.overlayOrigin, this.button.nativeElement);
  }
}
