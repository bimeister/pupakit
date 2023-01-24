import { getUuid, Nullable } from '@bimeister/utilities';
import { DndHostComponent } from '../../components/dnd-host/dnd-host.component';
import { DndItemConfig } from '../interfaces/dnd-item-config.interface';
import { BusEventBase } from '@bimeister/pupakit.common';

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
  export class DndMove<Source> extends DndEventBase {
    constructor(
      public readonly dndSourceHost: DndHostComponent,
      public readonly dndSourceItemConfigs: DndItemConfig<Source>[],
      public readonly dndTargetItemId: string | null,
      public readonly dndCloneCoords: [number, number]
    ) {
      super();
    }
  }

  export class DndDrop<Source> extends DndEventBase {
    constructor(
      public readonly dndSourceHost: DndHostComponent,
      public readonly dndSourceItemConfigs: DndItemConfig<Source>[],
      public readonly dndTargetItemId: string,
      public readonly dndTargetHostId: string,
      public readonly dndCloneCoords: [number, number]
    ) {
      super();
    }
  }
}
