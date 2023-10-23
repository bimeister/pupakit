import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  ViewEncapsulation,
} from '@angular/core';

const DEFAULT_ROTATION_TRANSFORM: string = 'rotateX(0deg) rotateY(0deg)';
type ResetType = 'onMouseLeave' | 'custom';

@Component({
  selector: 'pupa-floating-card',
  templateUrl: './floating-card.component.html',
  styleUrls: ['./floating-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class FloatingCardComponent {
  @HostBinding('style.transform') public transform: string = DEFAULT_ROTATION_TRANSFORM;

  @Input() public ratio: number = 2;
  @Input() public resetType: ResetType = 'onMouseLeave';

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  @HostListener('mousemove', ['$event'])
  public onMouseMove(event: MouseEvent): void {
    const transform: string = this.getTransform(event);
    this.elementRef.nativeElement.style.transform = transform;
  }

  @HostListener('mouseleave', ['$event'])
  public onMouseLeave(): void {
    if (this.resetType === 'onMouseLeave') {
      this.dropTransform();
    }
  }

  public dropTransform(): void {
    this.elementRef.nativeElement.style.transform = DEFAULT_ROTATION_TRANSFORM;
  }

  private getTransform(event: MouseEvent): string {
    const element: HTMLElement = this.elementRef.nativeElement;
    const { top, left }: DOMRect = element.getBoundingClientRect();
    const offsetY: number = event.pageY - top;
    const offsetX: number = event.pageX - left;
    const yToCenterRatio: number = (offsetY / element.offsetHeight) * 2 - 1;
    const xToCenterRatio: number = (offsetX / element.offsetWidth) * 2 - 1;
    const rotateYAxis: string = (yToCenterRatio * this.ratio * -1).toFixed(2);
    const rotateXAxis: string = (xToCenterRatio * this.ratio).toFixed(2);
    const transform: string = `
      perspective(${element.offsetHeight}px)
      rotateX(${rotateYAxis}deg)
      rotateY(${rotateXAxis}deg)
    `;
    return transform;
  }
}
