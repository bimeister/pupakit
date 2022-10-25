import { TableApi } from '../interfaces/table-api.interface';
import { TableFeature } from '../interfaces/table-feature.interface';

export type TableFeatureConstructor<T> = new (api: TableApi<T>) => TableFeature;
