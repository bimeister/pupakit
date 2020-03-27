import { DomSanitizer } from '@angular/platform-browser';

import { WidthUnitChanges } from '../interfaces/width-unit-changes.interface';
import { UnitStyleChangesProcessor } from './unit-style-changes-processor.class';

export class UnitWidthStyleChangesProcessor extends UnitStyleChangesProcessor<WidthUnitChanges> {
  constructor(protected readonly domSanitizer: DomSanitizer) {
    super(domSanitizer);
  }

  public process(changes: WidthUnitChanges): void {
    this.processStyleChanges(changes?.width);
    this.processPercentChanges(changes.widthPercents);
    this.processPxChanges(changes.widthPx);
    this.processVwChanges(changes.widthVw);
    this.processVhChanges(changes.widthVh);
    this.processRemChanges(changes.widthRem);
  }
}
