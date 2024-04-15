import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { ComponentChanges, Loader, LoaderKind, SizeRem } from '@bimeister/pupakit.common';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

type LoaderSize = SizeRem | 'inherit';

const DEFAULT_RADIUS: number = 10;

@Component({
  selector: 'pupa-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent implements OnChanges {
  @Input() public size: LoaderSize = 'inherit';
  public readonly size$: BehaviorSubject<LoaderSize> = new BehaviorSubject<LoaderSize>('inherit');

  @Input() public type: Loader = 'indeterminate';
  public readonly type$: BehaviorSubject<Loader> = new BehaviorSubject<Loader>('indeterminate');

  @Input() public kind: LoaderKind = 'default';
  public readonly kind$: BehaviorSubject<LoaderKind> = new BehaviorSubject<LoaderKind>('default');

  @Input() public progress: number = 0;
  public readonly progress$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  @Input() public isError: boolean = false;
  public readonly isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public errorText: string | null = null;
  public readonly errorText$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  public readonly radius: number = DEFAULT_RADIUS;
  public readonly determinateDasharray: number = 2 * Math.PI * this.radius;

  public readonly determinateDashOffset$: Observable<number> = this.progress$.pipe(
    map((progress: number) => this.determinateDasharray * ((100 - progress) / 100)),
    distinctUntilChanged()
  );

  public readonly kindClassName$: Observable<string | null> = this.kind$.pipe(
    map((kind: string) => `pupa-loader__indeterminate-icon_${kind}`),
    distinctUntilChanged()
  );

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (changes.hasOwnProperty('size')) {
      this.size$.next(changes.size.currentValue);
    }
    if (changes.hasOwnProperty('type')) {
      this.type$.next(changes.type.currentValue);
    }
    if (changes.hasOwnProperty('kind')) {
      this.kind$.next(changes.kind.currentValue);
    }
    if (changes.hasOwnProperty('progress')) {
      this.progress$.next(Math.max(0, Math.min(100, Number(changes.progress.currentValue) || 0)));
    }
    if (changes.hasOwnProperty('isError')) {
      this.isError$.next(changes.isError.currentValue);
    }
    if (changes.hasOwnProperty('errorText')) {
      this.errorText$.next(changes.errorText.currentValue);
    }
  }
}
