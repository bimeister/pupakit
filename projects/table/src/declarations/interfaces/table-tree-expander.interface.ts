export interface TableTreeExpanderElement extends HTMLElement {
  readonly dataset: DOMStringMap & { treeExpander: 'true' };
}
