export interface BaseTreeItem<T> {
  readonly isExpandable: boolean;
  name: string;
  id: string;
  originalData: T;
  readonly isElement: boolean;
}
