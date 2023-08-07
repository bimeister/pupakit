import { type SemanticConfiguration } from './semantic-configuration.interface';

export interface SemanticConfigurationGroup {
  name: string;
  configurations: SemanticConfiguration[];
}
