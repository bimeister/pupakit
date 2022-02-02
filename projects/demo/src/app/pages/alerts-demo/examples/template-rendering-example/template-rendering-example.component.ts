import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AlertsService } from '@kit/internal/shared/services/alerts.service';
import { AlertTemplateComponent } from '@kit/public-api';

interface AlertTemplateData {
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
  @ViewChild('alertTemplate', { static: true }) private readonly alertTemplateRef: TemplateRef<AlertTemplateData>;

  constructor(private readonly alertsService: AlertsService) {}

  public openAlert(): void {
    this.alertsService.open<AlertTemplateComponent<AlertTemplateData>>({
      component: AlertTemplateComponent,
      data: {
        templateRef: this.alertTemplateRef,
        templateContext: { $implicit: 'Pupa Lupa' },
      },
    });
  }
}
