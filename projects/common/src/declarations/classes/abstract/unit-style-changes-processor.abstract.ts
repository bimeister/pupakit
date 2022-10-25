import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { isNil } from '@bimeister/utilities';
import { ReplaySubject } from 'rxjs';
import { ComponentChange } from '../../interfaces/component-change.interface';
import { ComponentChanges } from '../../interfaces/component-changes.interface';

export abstract class UnitStyleChangesProcessor<C> {
  public readonly safeStyle$: ReplaySubject<SafeStyle> = new ReplaySubject<SafeStyle>(1);

  constructor(protected readonly domSanitizer: DomSanitizer) {}

  protected processStyleChanges(change: ComponentChange<C>): void {
    if (isNil(change?.currentValue)) {
      return;
    }
    this.updateSafeStyle(`${change?.currentValue}`);
  }

  protected processPercentChanges(change: ComponentChange<C>): void {
    if (isNil(change?.currentValue)) {
      return;
    }
    this.updateSafeStyle(`${change?.currentValue}%`);
  }

  protected processPxChanges(change: ComponentChange<C>): void {
    if (isNil(change?.currentValue)) {
      return;
    }
    this.updateSafeStyle(`${change?.currentValue}px`);
  }

  protected processVwChanges(change: ComponentChange<C>): void {
    if (isNil(change?.currentValue)) {
      return;
    }
    this.updateSafeStyle(`${change?.currentValue}vw`);
  }

  protected processVhChanges(change: ComponentChange<C>): void {
    if (isNil(change?.currentValue)) {
      return;
    }
    this.updateSafeStyle(`${change?.currentValue}vh`);
  }

  protected processRemChanges(change: ComponentChange<C>): void {
    if (isNil(change?.currentValue)) {
      return;
    }
    this.updateSafeStyle(`${change?.currentValue}rem`);
  }

  public abstract process(changes: ComponentChanges<C>): void;

  private updateSafeStyle(unsafeStyle: string): void {
    const safeStyle: SafeStyle = this.domSanitizer.bypassSecurityTrustStyle(unsafeStyle);
    if (isNil(safeStyle)) {
      return;
    }
    this.safeStyle$.next(safeStyle);
  }
}
