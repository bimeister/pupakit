import { DomSanitizer } from '@angular/platform-browser';

import { type HeightUnitChanges } from '../interfaces/height-unit-changes.interface';
import { UnitStyleChangesProcessor } from './abstract/unit-style-changes-processor.abstract';

export class UnitHeightStyleChangesProcessor<C> extends UnitStyleChangesProcessor<C> {
  constructor(protected readonly domSanitizer: DomSanitizer) {
    super(domSanitizer);
  }

  public process(changes: HeightUnitChanges<C>): void {
    this.processStyleChanges(changes?.height);
    this.processPercentChanges(changes.heightPercents);
    this.processPxChanges(changes.heightPx);
    this.processVwChanges(changes.heightVw);
    this.processVhChanges(changes.heightVh);
    this.processRemChanges(changes.heightRem);
  }
}
