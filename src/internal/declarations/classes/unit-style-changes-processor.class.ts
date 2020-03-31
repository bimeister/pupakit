import { SimpleChange, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';

import { isNullOrUndefined } from '../../helpers/is-null-or-undefined.helper';

export abstract class UnitStyleChangesProcessor<T> {
  public readonly safeStyle$: ReplaySubject<SafeStyle> = new ReplaySubject<SafeStyle>(1);

  constructor(protected readonly domSanitizer: DomSanitizer) {}

  protected processStyleChanges(change: SimpleChange): void {
    if (isNullOrUndefined(change?.currentValue)) {
      return;
    }
    this.updateSafeStyle(`${change?.currentValue}`);
  }

  protected processPercentChanges(change: SimpleChange): void {
    if (isNullOrUndefined(change?.currentValue)) {
      return;
    }
    this.updateSafeStyle(`${change?.currentValue}%`);
  }

  protected processPxChanges(change: SimpleChange): void {
    if (isNullOrUndefined(change?.currentValue)) {
      return;
    }
    this.updateSafeStyle(`${change?.currentValue}px`);
  }

  protected processVwChanges(change: SimpleChange): void {
    if (isNullOrUndefined(change?.currentValue)) {
      return;
    }
    this.updateSafeStyle(`${change?.currentValue}vw`);
  }

  protected processVhChanges(change: SimpleChange): void {
    if (isNullOrUndefined(change?.currentValue)) {
      return;
    }
    this.updateSafeStyle(`${change?.currentValue}vh`);
  }

  protected processRemChanges(change: SimpleChange): void {
    if (isNullOrUndefined(change?.currentValue)) {
      return;
    }
    this.updateSafeStyle(`${change?.currentValue}rem`);
  }

  public abstract process(changes: T & SimpleChanges): void;

  private updateSafeStyle(unsafeStyle: string): void {
    const safeStyle: SafeStyle = this.domSanitizer.bypassSecurityTrustStyle(unsafeStyle);
    if (isNullOrUndefined(safeStyle)) {
      return;
    }
    this.safeStyle$.next(safeStyle);
  }
}
