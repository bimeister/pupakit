import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ButtonSize } from '../../../../../internal/declarations/types/button-size.type';
import { ClientUiStateHandlerService } from '../../../../../internal/shared/services/client-ui-state-handler.service';
import { map } from 'rxjs/operators';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { isNil } from '@bimeister/utilities';

@Component({
  selector: 'pupa-drawer-button-icon-new',
  templateUrl: './drawer-button-icon-new.component.html',
  styleUrls: ['./drawer-button-icon-new.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerButtonIconNewComponent implements OnChanges {
  @Input() public icon: string;
  public readonly icon$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private readonly isMobile$: Observable<boolean> = this.clientUiStateHandlerService.breakpointIsXs$;

  public readonly size$: Observable<ButtonSize> = this.isMobile$.pipe(
    map((isMobile: boolean) => (isMobile ? 'medium' : 'small'))
  );

  constructor(private readonly clientUiStateHandlerService: ClientUiStateHandlerService) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processIconChange(changes?.icon);
  }

  private processIconChange(change: ComponentChange<this, string>): void {
    const currentValue: string | undefined = change?.currentValue;

    if (isNil(currentValue)) {
      return;
    }

    this.icon$.next(currentValue);
  }
}
