export interface TableTreeDefinition<TFeatureOptions = unknown> {
  modelIdKey?: string;
  modelParentIdKey?: string;
  modelIsExpandableKey?: string;
  modelIsExpandedKey?: string;
  modelLevelKey?: string;
  featureOptions?: TFeatureOptions;
}
