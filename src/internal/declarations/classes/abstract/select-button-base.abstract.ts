import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Directive, ElementRef, OnInit } from '@angular/core';
import { filterFalsy } from '@meistersoft/utilities';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { SelectStateService } from '../../interfaces/select-state-service.interface';

@Directive()
export abstract class SelectButtonBase<T> implements OnInit {
  protected abstract readonly overlayOrigin: CdkOverlayOrigin;
  protected abstract readonly button: ElementRef<HTMLButtonElement>;

  public abstract transparent: boolean;

  public readonly isExpanded$: Observable<boolean> = this.selectNewStateService.isExpanded$;
  public readonly isDisabled$: Observable<boolean> = this.selectNewStateService.isDisabled$;

  constructor(private readonly selectNewStateService: SelectStateService<T>) {}

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
