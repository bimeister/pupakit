import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  Renderer2
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { VOID } from './../../../constants/void.const';

@Component({
  selector: 'pupa-drawer-dragger',
  templateUrl: './drawer-dragger.component.html',
  styleUrls: ['./drawer-dragger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerDraggerComponent implements OnDestroy {
  @Input() public isVisible: boolean = true;

  private readonly isDragging$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly mouseOffsetFromElementPx$: Readonly<BehaviorSubject<number>> = new BehaviorSubject<number>(0);
  public readonly destroy$: Readonly<Subject<void>> = new Subject<void>();

  constructor(private readonly elementRef: ElementRef<HTMLElement>, private readonly renderer: Renderer2) {}

  @HostListener('mousedown')
  public processMouseDownEvent(): void {
    this.isDragging$.next(true);
  }

  @HostListener('window:mouseup')
  public processMouseUpEvent(): void {
    this.isDragging$.next(false);
    this.renderer.removeStyle(globalThis.document.body, 'cursor');
  }

  @HostListener('window:mousemove', ['$event'])
  public processMouseMove(event: MouseEvent): void {
    this.isDragging$
      .pipe(
        take(1),
        filter((isDragging: boolean) => isDragging)
      )
      .subscribe(() => {
        this.emitOffsetFromCurrentElement(event.clientX);
        this.renderer.setStyle(globalThis.document.body, 'cursor', 'col-resize');
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(VOID);
  }

  private emitOffsetFromCurrentElement(eventClientX: number): void {
    const clientRectXOffsetPx: number = this.elementRef.nativeElement.getBoundingClientRect().left;
    this.mouseOffsetFromElementPx$.next(eventClientX - clientRectXOffsetPx);
  }
}
