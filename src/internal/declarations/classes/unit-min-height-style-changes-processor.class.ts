import { DomSanitizer } from '@angular/platform-browser';

import { MinHeightUnitChanges } from '../interfaces/min-height-unit-changes.interface';
import { UnitStyleChangesProcessor } from './abstract/unit-style-changes-processor.abstract';

export class UnitMinHeightStyleChangesProcessor<C> extends UnitStyleChangesProcessor<C> {
  constructor(protected readonly domSanitizer: DomSanitizer) {
    super(domSanitizer);
  }

  public process(changes: MinHeightUnitChanges<C>): void {
    this.processStyleChanges(changes?.minHeight);
    this.processPercentChanges(changes.minHeightPercents);
    this.processPxChanges(changes.minHeightPx);
    this.processVwChanges(changes.minHeightVw);
    this.processVhChanges(changes.minHeightVh);
    this.processRemChanges(changes.minHeightRem);
  }
}
