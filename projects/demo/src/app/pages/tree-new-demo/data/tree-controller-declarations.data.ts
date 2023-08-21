export const treeControllerDeclarationsData: string = `
export class TreeController {
  // Uses to dispatch events in the tree.
  public readonly eventBus: EventBus = new EventBus();

  // In the constructor can be set up tree behavior options like scroll behavior, track by function and if tree has drag-and-drop
  constructor(protected readonly options?: Nullable<TreeControllerOptions>)

  // Uses to get options set up in the constructor
  public getOptions(): Nullable<TreeControllerOptions>

  // Uses to set the whole tree data
  public setData(data: FlatTreeItem[]): void

  /*
   Uses to make tree nodes selected.
   The input parameter is a string array with tree nodes' IDs to select.
  */
  public setSelected(...selectedIds: string[]): void

  // Uses to display the preloader
  public setLoading(isLoading: boolean): void

  // Uses to listen for event bus' events.
  public getEvents<E extends TreeEvents.TreeEventBase>(eventType: Type<E>): Observable<E>

  // Uses to get a reference to the current state of the tree.
  public getDataDisplayCollectionRef(): TreeDataDisplayCollectionRef

  /*
   Uses to add children to the selected tree item.
   Input parameters are the ID of the selected tree item and an array of children.
  */
  public addChildren(treeItemId: string, children: FlatTreeItem[]): void

  /*
   Uses to add children to the selected tree item with preventing adding previously added children.
   Input parameters are the ID of the selected tree item and an array of children.
  */
  public resetChildren(treeItemId: string, children: FlatTreeItem[]): void

  /*
   Uses to remove children from the selected tree item.
   The input parameter is the ID of the selected tree item.
  */
  public removeChildren(treeItemId: string): void

  /*
   Uses to remove the selected tree item.
   The input parameter is the ID of the selected tree item.
  */
  public removeTreeItem(treeItemId: string): void

  /*
   Uses to update the selected tree item data if exists.
   The input parameter is the selected tree item with new info.
  */
  public setTreeItem(treeItem: FlatTreeItem): void

  /*
   Uses to scroll to the selected tree item.
   The input parameter is the ID of the selected tree item.
  */
  public scrollTo(treeItemId: string): void

    /*
   Uses to scroll to force the vertical scroll.
   The input parameter is number which is count of pixels for scrolling.
  */
  public scrollTop(scrollTopPx: number): void
}
`;
