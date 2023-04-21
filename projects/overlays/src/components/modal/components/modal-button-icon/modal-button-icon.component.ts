import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isNil } from '@bimeister/utilities';
import { ClientUiStateHandlerService, ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { ButtonSize } from '@bimeister/pupakit.kit';

@Component({
  selector: 'pupa-modal-button-icon',
  templateUrl: './modal-button-icon.component.html',
  styleUrls: ['./modal-button-icon.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalButtonIconComponent implements OnChanges {
  @Input() public icon: string;
  public readonly icon$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  @Input() public active: boolean;
  public readonly active$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly isMobile$: Observable<boolean> = this.clientUiStateHandlerService.breakpointIsXs$;

  public readonly size$: Observable<ButtonSize> = this.isMobile$.pipe(
    map((isMobile: boolean) => (isMobile ? 's' : 'm'))
  );

  constructor(private readonly clientUiStateHandlerService: ClientUiStateHandlerService) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processIconChange(changes?.icon);
    this.processActiveChange(changes?.active);
  }

  private processIconChange(change: ComponentChange<this, string>): void {
    const currentValue: string | undefined = change?.currentValue;

    if (isNil(currentValue)) {
      return;
    }

    this.icon$.next(currentValue);
  }

  private processActiveChange(change: ComponentChange<this, boolean>): void {
    const currentValue: boolean | undefined = change?.currentValue;

    if (isNil(currentValue)) {
      return;
    }

    this.active$.next(currentValue);
  }
}
