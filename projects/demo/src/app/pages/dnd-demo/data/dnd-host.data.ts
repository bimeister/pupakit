export const dndHostData: string = `
export class DndHost {
  // Id of host element.
  // Can be used to filter events only from desired hosts
  @Input() public hostId: string;

  // Enables or disables the ability to move host elements
  @Input() public isDraggable: boolean = true;

  // Used to calculate drop position and indicator coordinates of draggable items
  @Input() public dndItemsDirection: 'row' | 'column' = 'column';

  // Dnd clone items template
  @Input() public dndCloneItemsTemplateRef: TemplateRef<DndItemTemplateContext<T>>;

  // Used for typing source items
  @Input() public sourceType: Source;

  // Used for typing target item
  @Input() public targetType: Target;

  // Event emitted all the time while dnd clone is moving for all hosts
  @Output() public readonly dndMove: EventEmitter<DndMoveData> = new EventEmitter<DndMoveData>();

  // Event emitted when dnd clone is dropped on host.
  // Event is emitted only for source host (the host from which dnd items were moved)
  // and target host (the host where we dropped source dnd items)
  @Output() public readonly dndDrop: EventEmitter<DndDropData> = new EventEmitter<DndDropData>();
}
`;
