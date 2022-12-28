import { BusEventBase } from '@bimeister/pupakit.common';
import { getUuid, Nullable } from '@bimeister/utilities';
import { DndHostComponent } from '../../components/dnd/components/dnd-host/dnd-host.component';
import { DndItemConfig } from '../interfaces/dnd-item-config.interface';

export namespace DndEvents {
  export class DndEventBase<T = unknown> extends BusEventBase<T> {
    public readonly scope: Nullable<string> = null;
    public readonly id: string = getUuid();
    public readonly type: Nullable<string> = null;
    public readonly payload: T = null;

    protected constructor(public readonly fromId: Nullable<string> = null) {
      super();
    }
  }
  export class DndMove extends DndEventBase {
    constructor(
      public readonly dndSourceItemConfigs: DndItemConfig[],
      public readonly dndTargetItemId: string | null,
      public readonly dndCloneCoords: [number, number],
      public readonly sourceHost: DndHostComponent
    ) {
      super();
    }
  }

  export class DndDrop extends DndEventBase {
    constructor(
      public readonly dndSourceItemConfigs: DndItemConfig[],
      public readonly dndTargetItemId: string,
      public readonly dndCloneCoords: [number, number],
      public readonly sourceHost: DndHostComponent
    ) {
      super();
    }
  }
}
