import { ChangeDetectionStrategy, Component, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { Alert, AlertsService, AlertType } from 'src/lib/layout/services/alerts.service';
import { DrawersService, LayoutDrawerConfiguration } from 'src/lib/layout/services/drawers.service';
import { ModalWindowConfiguration, ModalWindowService } from 'src/lib/layout/services/modal-window.service';

import { LoaderDemoComponent } from '../loader-demo/loader-demo.component';

@Component({
  selector: 'demo-overlay',
  styleUrls: ['../demo.scss', './layout-demo.component.scss'],
  templateUrl: './layout-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutDemoComponent {
  private readonly step: number = 0.25;

  private drawerId: string = null;

  constructor(
    private readonly drawersService: DrawersService,
    private readonly alertsService: AlertsService,
    private readonly modalWindowService: ModalWindowService,
    private readonly componentFactoryResolver: ComponentFactoryResolver
  ) {}

  public openDrawer(float: 'left' | 'right'): void {
    const componentFactory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(
      LoaderDemoComponent
    );
    const configuration: LayoutDrawerConfiguration = {
      enableOverlay: false,
      clickableOverlay: true,
      float,
      closeButton: true
    };
    this.drawersService.create(componentFactory, configuration).subscribe();
  }

  public openDrawerAndOverlay(float: 'left' | 'right'): void {
    const componentFactory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(
      LoaderDemoComponent
    );
    const configuration: LayoutDrawerConfiguration = {
      enableOverlay: true,
      clickableOverlay: true,
      zIndex: 100,
      float
    };
    this.drawersService.create(componentFactory, configuration).subscribe();
  }

  public openDrawerNotDestroy(mode: boolean): void {
    if (this.drawerId === null && mode) {
      const componentFactory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(
        LoaderDemoComponent
      );
      const configuration: LayoutDrawerConfiguration = {
        enableOverlay: false,
        clickableOverlay: false,
        destroyContentOnClose: false,
        closeButton: true
      };
      this.drawersService.create(componentFactory, configuration).subscribe((drawerId: string) => {
        this.drawerId = drawerId;
      });
      return;
    }
    if (!mode) {
      this.drawersService.closeDrawerById(this.drawerId);
      return;
    }
    this.drawersService.openDrawerById(this.drawerId);
    return;
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
    const componentFactory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(
      LoaderDemoComponent
    );
    this.modalWindowService.create(componentFactory, configCollection[index]).subscribe();
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
