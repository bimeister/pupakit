export const dndMoveData: string = `
export interface DndMoveData {
  // Source host id. Can be used for filtering events from other hosts
  dndSourceHostId: string;

  // Movable items
  dndSourceItems: DndItem[];

  // Element over which dnd clone is moved (null, if event emitted outside host client rect)
  dndTargetItem: DndItem | null;

  // Drop position of source items. Can be after target item or within target item (null, if event emitted outside host client rect)
  dndDropPosition: DndDropPosition | null;

  // Pre-calculated dnd indicator coords
  // (top coords if dndItemsDirection of host is column, left coords if dndItemsDirection of host is row)
  // (null, if event emitted outside host client rect)
  dndIndicatorCoords: number | null;

  // true if dndSourceItems belong current host, false otherwise
  currentHostIsSource: boolean;

  // true if dndCloneCoords inside client rect of current host, false otherwise
  currentHostIsTarget: boolean;

  // Top left coords of first dnd clone
  dndCloneCoords: [number, number];
}
`;
