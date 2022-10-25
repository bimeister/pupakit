import { DomSanitizer } from '@angular/platform-browser';

import { WidthUnitChanges } from '../interfaces/width-unit-changes.interface';
import { UnitStyleChangesProcessor } from './abstract/unit-style-changes-processor.abstract';

export class UnitWidthStyleChangesProcessor<C> extends UnitStyleChangesProcessor<C> {
  constructor(protected readonly domSanitizer: DomSanitizer) {
    super(domSanitizer);
  }

  public process(changes: WidthUnitChanges<C>): void {
    this.processStyleChanges(changes?.width);
    this.processPercentChanges(changes.widthPercents);
    this.processPxChanges(changes.widthPx);
    this.processVwChanges(changes.widthVw);
    this.processVhChanges(changes.widthVh);
    this.processRemChanges(changes.widthRem);
  }
}
