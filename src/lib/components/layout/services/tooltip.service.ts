import { Injectable } from '@angular/core';
import { isNil } from '@bimeister/utilities/commonjs/common';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TooltipConfig } from '../../../../internal/declarations/interfaces/tooltip-config.interface';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {
  private readonly tooltipContentState$: ReplaySubject<TooltipConfig> = new ReplaySubject<TooltipConfig>(null);

  public readonly isOpened$: Observable<boolean> = this.tooltipContentState$.pipe(
    map((tooltipContent: TooltipConfig) => !isNil(tooltipContent))
  );
  public readonly tooltipContent$: Observable<TooltipConfig> = this.tooltipContentState$;

  public open(tooltipContent: TooltipConfig): void {
    this.tooltipContentState$.next(tooltipContent);
  }
  public close(): void {
    this.tooltipContentState$.next(null);
  }
}
