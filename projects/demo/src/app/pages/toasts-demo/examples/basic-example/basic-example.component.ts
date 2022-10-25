import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { OpenedToast, ToastsService } from '@bimeister/pupakit.overlays';
import { filterTruthy } from '@bimeister/utilities';

@Component({
  selector: 'demo-basic-example',
  templateUrl: './basic-example.component.html',
  styleUrls: ['./basic-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class BasicExampleComponent {
  constructor(private readonly toastsService: ToastsService) {}

  public openToast(): void {
    const openedToast: OpenedToast<boolean> = this.toastsService.open({
      data: {
        bodyText: 'Some body text!',
        actionText: 'Ok',
        type: 'info',
        autoCloseTimeMs: 8_000,
        hasTimer: true,
      },
    });

    // eslint-disable-next-line no-console
    openedToast.closeTriggered$.pipe(filterTruthy()).subscribe(() => console.log('Alert action triggered!'));
  }
}
