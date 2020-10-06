import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { filterFalsy } from '@meistersoft/utilities';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { SelectNewStateService } from '../../../services/select-new-state.service';

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

  @Input() public transparent: boolean = false;

  public readonly isExpanded$: Observable<boolean> = this.selectNewStateService.isExpanded$;
  public readonly isDisabled$: Observable<boolean> = this.selectNewStateService.isDisabled$;

  constructor(private readonly selectNewStateService: SelectNewStateService<T>) {}

  public ngOnInit(): void {
    this.defineDropdownTrigger();
  }

  public processButtonClick(): void {
    this.isDisabled$.pipe(take(1), filterFalsy()).subscribe(() => this.selectNewStateService.toggleExpansion());
  }

  private defineDropdownTrigger(): void {
    this.selectNewStateService.defineDropdownTrigger(this.overlayOrigin, this.button.nativeElement);
  }
}
