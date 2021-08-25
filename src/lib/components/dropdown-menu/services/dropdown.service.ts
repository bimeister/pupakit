import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { Nullable } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DropdownService {
  public readonly isOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly dropdownOverlayOrigin$: BehaviorSubject<Nullable<CdkOverlayOrigin>> = new BehaviorSubject<
    Nullable<CdkOverlayOrigin>
  >(null);

  public registerTooltipOverlayOrigin(dropdownOverlayOrigin: CdkOverlayOrigin): void {
    this.dropdownOverlayOrigin$.next(dropdownOverlayOrigin);
  }

  public setOpened(isOpened: boolean): void {
    this.isOpened$.next(isOpened);
  }
}
