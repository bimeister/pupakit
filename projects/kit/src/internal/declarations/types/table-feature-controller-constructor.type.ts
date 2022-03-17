import { TableApi } from '../interfaces/table-api.interface';
import { TableFeatureController } from '../interfaces/table-feature-controller.interface';

export type TableFeatureControllerConstructor<T> = new (api: TableApi<T>) => TableFeatureController;
