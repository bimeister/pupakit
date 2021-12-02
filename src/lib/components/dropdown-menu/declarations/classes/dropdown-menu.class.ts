import { ElementRef, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';
import { ComponentPortal } from '@angular/cdk/portal';
import { filterNotNil } from '@bimeister/utilities';
import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  HorizontalConnectionPos,
  Overlay,
  VerticalConnectionPos,
} from '@angular/cdk/overlay';
import { DropdownMenuContainerComponent } from '../../components/dropdown-menu-container/dropdown-menu-container.component';
import { DropdownBase } from './abstract/dropdown-base.abstract';
import { Uuid } from '../../../../../internal/declarations/types/uuid.type';
import { DROPDOWN_CONTEXT_ID_TOKEN } from '../../constants/tokens/dropdown-context-id.token';

const HORIZONTAL_POSITIONS: HorizontalConnectionPos[] = ['center', 'end', 'start'];
const VERTICAL_POSITIONS: VerticalConnectionPos[] = ['top', 'bottom'];

export class DropdownMenu extends DropdownBase<DropdownMenuContainerComponent> {
  private readonly contentHorizontalPosition$: BehaviorSubject<HorizontalConnectionPos> =
    new BehaviorSubject<HorizontalConnectionPos>('start');

  private readonly overlayPositions$: Observable<ConnectionPositionPair[]> = this.contentHorizontalPosition$.pipe(
    map((horizontalPosition: HorizontalConnectionPos) =>
      this.getOverlayPositionsByHorizontalPosition(horizontalPosition)
    )
  );

  constructor(overlay: Overlay, private readonly contextId: Uuid) {
    super(overlay);
  }

  protected getComponentPortal(): ComponentPortal<DropdownMenuContainerComponent> {
    const portalInjector: Injector = Injector.create({
      providers: [
        {
          provide: DROPDOWN_CONTEXT_ID_TOKEN,
          useValue: this.contextId,
        },
      ],
    });

    return new ComponentPortal(DropdownMenuContainerComponent, null, portalInjector);
  }

  protected getPositionStrategy(): Observable<FlexibleConnectedPositionStrategy> {
    return this.triggerRef$.pipe(
      take(1),
      filterNotNil(),
      withLatestFrom(this.overlayPositions$),
      map(([triggerRef, overlayPositions]: [ElementRef<HTMLElement>, ConnectionPositionPair[]]) => {
        const positionStrategy: FlexibleConnectedPositionStrategy = this.overlay
          .position()
          .flexibleConnectedTo(triggerRef)
          .withFlexibleDimensions(false)
          .withPositions(overlayPositions)
          .withViewportMargin(4);

        return positionStrategy;
      })
    );
  }

  public setContentHorizontalPosition(position: HorizontalConnectionPos): void {
    this.contentHorizontalPosition$.next(position);
  }

  private getOverlayPositionsByHorizontalPosition(
    currentHorizontalPos: HorizontalConnectionPos
  ): ConnectionPositionPair[] {
    const sortedHorizontalPositions: HorizontalConnectionPos[] = HORIZONTAL_POSITIONS.sort(
      (horizontalPos: HorizontalConnectionPos) => (horizontalPos === currentHorizontalPos ? -1 : 1)
    );

    const overlayPositions: ConnectionPositionPair[] = VERTICAL_POSITIONS.flatMap(
      (verticalPos: VerticalConnectionPos) =>
        sortedHorizontalPositions.map((horizontalPos: HorizontalConnectionPos) =>
          this.getConnectionPositionPair(horizontalPos, verticalPos)
        )
    );

    return overlayPositions;
  }

  private getConnectionPositionPair(
    overlayX: HorizontalConnectionPos,
    overlayY: VerticalConnectionPos
  ): ConnectionPositionPair {
    return new ConnectionPositionPair({ originX: overlayX, originY: 'bottom' }, { overlayX, overlayY });
  }
}
