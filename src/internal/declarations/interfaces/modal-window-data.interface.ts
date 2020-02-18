import { ComponentFactory, Injector } from '@angular/core';

import { ModalWindowConfiguration } from './modal-window-configuration.interface';

export interface ModalWindowData extends ModalWindowConfiguration {
  id: string;
  componentFactory: ComponentFactory<any>;
  injector?: Injector;
}
