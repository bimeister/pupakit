import { ChangeDetectionStrategy, Component, Injector, ViewEncapsulation } from '@angular/core';
import { Theme } from '@kit/internal/declarations/enums/theme.enum';
import { OpenedModal } from '@kit/internal/declarations/interfaces/opened-modal.interface';
import { ModalsService } from '@kit/internal/shared/services/modals.service';
import { ThemeWrapperService } from '@kit/lib/components/theme-wrapper/services/theme-wrapper.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ModalDemoExample3Component } from '../modal-content/modal-demo-example-3.component';

@Component({
  selector: 'pupa-modal-demo-example-3-helper',
  templateUrl: './modal-demo-example-3-helper.component.html',
  styleUrls: ['./modal-demo-example-3-helper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ModalDemoExample3HelperComponent {
  public modalCloseMessage$: Observable<string>;

  constructor(
    private readonly modalsService: ModalsService,
    private readonly injector: Injector,
    private readonly themeWrapperService: ThemeWrapperService
  ) {}

  public openModal(): void {
    this.themeWrapperService.theme$.pipe(take(1)).subscribe((theme: Theme) => {
      const modal: OpenedModal<string> = this.modalsService.open(ModalDemoExample3Component, {
        injector: this.injector,
        closeOnBackdropClick: false,
        isBackdropTransparent: true,
        theme,
      });

      this.modalCloseMessage$ = modal.closed$;
    });
  }
}
