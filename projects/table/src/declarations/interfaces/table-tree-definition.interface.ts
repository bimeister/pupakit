export interface TableTreeDefinition {
  modelIdKey: string;
  modelParentIdKey: string;
  modelExpandableKey: string;
  modelExpandedKey: string;
  modelLevelKey: string;
  modelNestedRowNumberKey: string;
  treeNodeMarker?: string;
}
