export const dndItemData: string = `
export class DndItemDirective<T> {
  // Item related data
  @Input() public dndItemData: T;

  // Item id
  @Input() public dndItemId: string;

  // Filter func. Return true, if current item can be draggable, false otherwise
  @Input() public canBeMoved: DndCanBeMovedFunc<T> = () => true;

  // Filter func. Return true, if current item can be droppable for source items, false otherwise
  @Input() public canBeDroppableFor: DndCanBeDroppableForFunc<T> = () => true;
}
`;
