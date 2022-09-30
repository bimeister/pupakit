import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { ThemeService } from '../../../../../internal/shared/services/theme.service';
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
  public readonly reversedTheme$: Observable<Theme> = this.themeService.reversedTheme$;

  constructor(
    @Inject(TOAST_CONTAINER_DATA_TOKEN) private readonly data: ToastContainerData,
    private readonly themeService: ThemeService
  ) {}
}
