import { VisualizationConfiguration } from './visualization-configuration.interface';

export interface VisualizationConfigurationGroup {
  name: string;
  configurations: VisualizationConfiguration[];
}
