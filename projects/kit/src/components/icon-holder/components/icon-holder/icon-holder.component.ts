import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, type OnChanges } from '@angular/core';
import { type ComponentChange, type ComponentChanges } from '@bimeister/pupakit.common';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { type IconHolderKind } from '../../../../declarations/types/icon-holder-kind.type';
import { type IconHolderSize } from '../../../../declarations/types/icon-holder-size.type';

@Component({
  selector: 'pupa-icon-holder',
  templateUrl: './icon-holder.component.html',
  styleUrls: ['./icon-holder.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconHolderComponent implements OnChanges {
  @Input() public size: IconHolderSize = 'large';
  @Input() public kind: IconHolderKind = 'opacity';
  @Input() public withBackground: boolean = true;

  private readonly kind$: BehaviorSubject<IconHolderKind> = new BehaviorSubject<IconHolderKind>('opacity');
  private readonly size$: BehaviorSubject<IconHolderSize> = new BehaviorSubject<IconHolderSize>('large');

  public readonly resultClassList$: Observable<string[]> = combineLatest([this.kind$, this.size$]).pipe(
    map((classes: string[]) => classes.map((innerClass: string) => `holder_${innerClass}`))
  );

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (changes.hasOwnProperty('size')) {
      this.processSizeChange(changes?.size);
    }

    if (changes.hasOwnProperty('kind')) {
      this.processColorChange(changes?.kind);
    }
  }

  private processSizeChange(change: ComponentChange<this, IconHolderSize>): void {
    this.size$.next(change.currentValue);
  }

  private processColorChange(change: ComponentChange<this, IconHolderKind>): void {
    this.kind$.next(change.currentValue);
  }
}
