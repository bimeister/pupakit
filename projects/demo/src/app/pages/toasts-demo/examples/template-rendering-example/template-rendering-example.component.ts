import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { OpenedToast, ToastsService, ToastTemplateComponent } from '@bimeister/pupakit.overlays';
import { filterTruthy } from '@bimeister/utilities';

interface ToastTemplateData {
  $implicit: string;
}

@Component({
  selector: 'demo-template-rendering-example',
  templateUrl: './template-rendering-example.component.html',
  styleUrls: ['./template-rendering-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class TemplateRenderingExampleComponent {
  @ViewChild('toastTemplate', { static: true }) private readonly toastTemplateRef: TemplateRef<ToastTemplateData>;

  constructor(private readonly toastsService: ToastsService) {}

  public openToast(): void {
    const openedToast: OpenedToast<boolean> = this.toastsService.open<ToastTemplateComponent<ToastTemplateData>>({
      component: ToastTemplateComponent,
      data: {
        templateRef: this.toastTemplateRef,
        templateContext: { $implicit: 'Pupa Lupa' },
      },
    });

    // eslint-disable-next-line no-console
    openedToast.closeTriggered$.pipe(filterTruthy()).subscribe(() => console.log('Alert action triggered!'));
  }
}
