import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ClientUiStateHandlerService, ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { ButtonSize } from '@bimeister/pupakit.kit';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'pupa-drawer-button-icon',
  templateUrl: './drawer-button-icon.component.html',
  styleUrls: ['./drawer-button-icon.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerButtonIconComponent implements OnChanges {
  @Input() public icon: string;
  public readonly icon$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  @Input() public disabled: boolean = false;
  public readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly isMobile$: Observable<boolean> = this.clientUiStateHandlerService.breakpointIsXs$;

  public readonly size$: Observable<ButtonSize> = this.isMobile$.pipe(
    map((isMobile: boolean) => (isMobile ? 'm' : 's'))
  );

  constructor(private readonly clientUiStateHandlerService: ClientUiStateHandlerService) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processIconChange(changes?.icon);
    this.processDisabledChange(changes?.disabled);
  }

  private processIconChange(change: ComponentChange<this, string>): void {
    const currentValue: string | undefined = change?.currentValue;

    if (isNil(currentValue)) {
      return;
    }

    this.icon$.next(currentValue);
  }

  private processDisabledChange(change: ComponentChange<this, boolean | null>): void {
    const currentValue: boolean | null = change?.currentValue;

    if (isNil(currentValue)) {
      return;
    }

    this.disabled$.next(currentValue);
  }
}
