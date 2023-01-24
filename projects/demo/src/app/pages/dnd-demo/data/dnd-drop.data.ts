export const dndDropData: string = `
export interface DndDropData {
  // Source host id. Can be used for filtering events from other hosts
  dndSourceHostId: string;

  // Target host id. Can be used for filtering events from other hosts
  dndTargetHostId: string;

  // Dropped items
  dndSourceItems: DndItem[];

  // Item over which source items were dropped (null, if currentHostIsSource && !currentHostIsTarget)
  dndTargetItem: DndItem | null;

  // Drop position of source items. Can be after target item or within target item (null, if currentHostIsSource && !currentHostIsTarget)
  dndDropPosition: DndDropPosition | null;

  // true if source items belong current host, false otherwise
  currentHostIsSource: boolean;

  // true if source items dropped inside client rect of current host, false otherwise
  currentHostIsTarget: boolean;
}
`;
