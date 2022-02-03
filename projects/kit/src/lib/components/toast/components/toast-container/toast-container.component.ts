import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';

import { TOAST_CONTAINER_DATA_TOKEN } from '../../../../../internal/constants/tokens/toast-container-data.token';
import { Theme } from '../../../../../internal/declarations/enums/theme.enum';
import { ToastContainerData } from '../../../../../internal/declarations/interfaces/toast-container-data.interface';

@Component({
  selector: 'pupa-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  public readonly componentPortal: ComponentPortal<unknown> = this.data.componentPortal;
  public readonly theme$: Observable<Theme> = this.data.theme$;

  constructor(@Inject(TOAST_CONTAINER_DATA_TOKEN) private readonly data: ToastContainerData) {}
}
