import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ClientUiStateHandlerService, UiState } from '@bimeister/pupakit.common';
import { filterNotNil } from '@bimeister/utilities';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoaderType } from '../../../../declarations/types/loader-type.type';
import { GridStateService } from '../../../../services/grid-state.service';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'pupa-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class LayoutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('iframe', { static: true }) private readonly iframeElementRef: ElementRef<HTMLIFrameElement>;

  public readonly isLoaderVisible$: Observable<boolean> = this.loaderService.isLoaderVisible$;
  public readonly loaderType$: Observable<LoaderType> = this.loaderService.loaderType$;
  public readonly loaderOverlayTopOffsetPx$: Observable<number> = this.loaderService.loaderOverlayTopOffsetPx$.pipe(
    filterNotNil()
  );

  public readonly countOfColumns$: Observable<number> = this.clientUiHandlerService.uiState$.pipe(
    filterNotNil(),
    map(({ countOfColumns }: UiState) => countOfColumns),
    filterNotNil()
  );

  public readonly columns$: Observable<number[]> = this.countOfColumns$.pipe(
    map((countOfColumns: number) =>
      Array(countOfColumns)
        .fill(undefined)
        .map((_: undefined, index: number) => index + 1)
    )
  );

  public readonly isGridVisible$: Observable<boolean> = this.gridStateService.isGridVisible$;

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly loaderService: LoaderService,
    private readonly clientUiHandlerService: ClientUiStateHandlerService,
    private readonly gridStateService: GridStateService
  ) {}

  public ngAfterViewInit(): void {
    this.setIframeElement();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public readonly trackByColumnIndex: TrackByFunction<number> = (_: number, item: number) => item;

  private setIframeElement(): void {
    this.clientUiHandlerService.setIframeElement(this.iframeElementRef.nativeElement);
  }
}
