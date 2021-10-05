import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  CdkOverlayOrigin,
  ConnectionPositionPair,
  HorizontalConnectionPos,
  VerticalConnectionPos
} from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, Input, OnChanges, Optional, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { ThemeWrapperService } from '../../../theme-wrapper/services/theme-wrapper.service';
import { DropdownService } from '../../services/dropdown.service';

const ANIMATION_DURATION_MS: number = 150;
const HORIZONTAL_POS_LIST: HorizontalConnectionPos[] = ['center', 'end', 'start'];

@Component({
  selector: 'pupa-dropdown-menu-content',
  templateUrl: './dropdown-menu-content.component.html',
  styleUrls: ['./dropdown-menu-content.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('dropdownShow', [
      state('void', style({ transform: 'translateY(10px)', opacity: 0 })),
      state('show', style({ transform: 'translateY(0px)', opacity: 1 })),
      transition('void => show', [animate(`${ANIMATION_DURATION_MS}ms ease-in`)]),
      transition('show => void', [animate(`${ANIMATION_DURATION_MS}ms ease-out`)])
    ])
  ]
})
export class DropdownMenuContentComponent implements OnChanges {
  @Input() public horizontalPosition: HorizontalConnectionPos = 'center';

  public readonly dropdownOverlayOrigin$: Observable<CdkOverlayOrigin> = this.dropdownService.dropdownOverlayOrigin$;
  public readonly isOpened$: BehaviorSubject<boolean> = this.dropdownService.isOpened$;
  public readonly animationState$: Observable<'void' | 'show'> = this.isOpened$.pipe(
    map((isOpened: boolean) => (isOpened ? 'show' : 'void'))
  );
  public readonly themeClass$: Observable<string> = this.themeWrapperService?.themeClass$ || of('');
  public overlayPositions: ConnectionPositionPair[];

  constructor(
    private readonly dropdownService: DropdownService,
    @Optional() private readonly themeWrapperService?: ThemeWrapperService
  ) {}

  public ngOnChanges(): void {
    this.setOverlayPositions();
  }

  public onOverlayOutsideClick(event: MouseEvent): void {
    this.dropdownOverlayOrigin$
      .pipe(
        take(1),
        filter(({ elementRef }: CdkOverlayOrigin) => !elementRef.nativeElement.contains(event.target))
      )
      .subscribe(() => this.dropdownService.setOpened(false));
  }

  private getConnectionPositionPair(
    overlayX: HorizontalConnectionPos,
    overlayY: VerticalConnectionPos
  ): ConnectionPositionPair {
    return new ConnectionPositionPair({ originX: overlayX, originY: 'bottom' }, { overlayX, overlayY });
  }

  private setOverlayPositions(): void {
    const sortedHorizontalPosList: HorizontalConnectionPos[] = HORIZONTAL_POS_LIST.sort(
      (item: HorizontalConnectionPos) => (item === this.horizontalPosition ? -1 : 1)
    );
    this.overlayPositions = [
      ...sortedHorizontalPosList.map((item: HorizontalConnectionPos) => this.getConnectionPositionPair(item, 'top')),
      ...sortedHorizontalPosList.map((item: HorizontalConnectionPos) => this.getConnectionPositionPair(item, 'bottom'))
    ];
  }
}
