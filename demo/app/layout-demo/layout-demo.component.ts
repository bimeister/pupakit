import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Alert, AlertsService, AlertType } from 'src/lib/core/components/layout/alerts.service';
import { DrawersService, LayoutDrawerConfiguration } from 'src/lib/core/components/layout/drawers.service';
import { ModalWindowConfiguration, ModalWindowService } from 'src/lib/core/components/layout/modal-window.service';

import { LoaderDemoComponent } from '../loader-demo/loader-demo.component';

@Component({
  selector: 'demo-overlay',
  styleUrls: ['../demo.scss', './layout-demo.component.scss'],
  templateUrl: './layout-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutDemoComponent {
  private readonly step: number = 0.25;

  constructor(
    private readonly drawersService: DrawersService,
    private readonly alertsService: AlertsService,
    private readonly modalWindowService: ModalWindowService
  ) {}

  public openDrawer(float: 'left' | 'right'): void {
    const configuration: LayoutDrawerConfiguration = {
      enableOverlay: false,
      clickableOverlay: true,
      float,
      closeButton: true
    };
    this.drawersService.create(LoaderDemoComponent, configuration).subscribe();
  }

  public openDrawerAndOverlay(float: 'left' | 'right'): void {
    const configuration: LayoutDrawerConfiguration = {
      enableOverlay: true,
      clickableOverlay: true,
      zIndex: 100,
      float
    };
    this.drawersService.create(LoaderDemoComponent, configuration).subscribe();
  }

  public openModalWindow(index: number = 0): void {
    const configCollection: ModalWindowConfiguration[] = [
      {},
      { title: 'Заголовок' },
      { closeButton: true },
      { title: 'Заголовок', closeButton: true },
      { canPadding: false },
      { title: 'Заголовок', closeButton: true, canPadding: false },
      { enableOverlay: false, closeButton: true, canMove: true },
      { size: 'large', enableOverlay: false, closeButton: true, canMove: true },
      { size: 'small', enableOverlay: false, closeButton: true, canMove: true }
    ];
    this.modalWindowService.create(LoaderDemoComponent, configCollection[index]).subscribe();
  }

  public addAlert(): void {
    const alert: Alert = {
      id: null,
      text: 'Текст сообщения',
      type: this.randomAlertType(),
      needClosed: this.randomCloseMode()
    };
    this.alertsService.create(alert).subscribe();
  }

  private randomAlertType(): AlertType {
    const result: number = Math.random();
    return result < this.step
      ? 'info'
      : // tslint:disable-next-line: no-magic-numbers
      result < this.step * 2
      ? 'warning'
      : // tslint:disable-next-line: no-magic-numbers
      result < this.step * 3
      ? 'success'
      : 'danger';
  }

  private randomCloseMode(): boolean {
    const result: number = Math.random();
    // tslint:disable-next-line: no-magic-numbers
    return result < this.step * 2 ? true : false;
  }
}
