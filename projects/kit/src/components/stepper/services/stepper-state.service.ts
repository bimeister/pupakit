import { Injectable } from '@angular/core';
import { TabsServiceBase } from '../../../declarations/classes/abstract/tabs-service-base.abstract';

@Injectable()
export class StepperStateService<T> extends TabsServiceBase<T> {}
