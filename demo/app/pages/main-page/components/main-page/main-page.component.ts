import { Component, ElementRef, Inject, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Theme } from '../../../../../../src/internal/declarations/enums/theme.enum';
import { ThemeWrapperService } from '../../../../../../src/lib/components/theme-wrapper/services/theme-wrapper.service';
import { DOCUMENT } from '@angular/common';
import { subscribeOutsideAngular } from '../../../../../../src/internal/functions/rxjs-operators/subscribe-outside-angular.operator';

@Component({
  selector: 'demo-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnDestroy {
  @ViewChild('parallax', { read: ElementRef, static: false }) public parallaxElement: ElementRef;

  private readonly subscription: Subscription = new Subscription();

  public readonly logo$: Observable<SafeResourceUrl> = this.themeWrapperService.theme$.pipe(
    map((themeMode: Theme) => {
      return themeMode === Theme.Light ? this.logoLight : this.logoDark;
    })
  );

  private readonly logoDark: SafeResourceUrl;
  private readonly logoLight: SafeResourceUrl;
  public readonly logoIcon: SafeResourceUrl;

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly themeWrapperService: ThemeWrapperService,
    private readonly ngZone: NgZone,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    this.logoLight = this.sanitizer.bypassSecurityTrustResourceUrl('assets/logo-light.svg');
    this.logoDark = this.sanitizer.bypassSecurityTrustResourceUrl('assets/logo-dark.svg');
    this.logoIcon = this.sanitizer.bypassSecurityTrustResourceUrl('assets/logo-icon.svg');

    this.subscription.add(this.rotateParallaxElementWhenMouseMoved());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private rotateParallaxElementWhenMouseMoved(): Subscription {
    return fromEvent(this.document, 'mousemove')
      .pipe(subscribeOutsideAngular(this.ngZone))
      .subscribe((mouseEvent: MouseEvent) => {
        this.setRotate3dStyleByMouseEvent(mouseEvent);
      });
  }

  private setRotate3dStyleByMouseEvent(mouseEvent: MouseEvent): void {
    const clientRect: ClientRect = this.parallaxElement.nativeElement.getBoundingClientRect();
    this.parallaxElement.nativeElement.style.transform = this.getRotate3dStyle(mouseEvent, clientRect);
  }

  private getRotate3dStyle({ clientX, clientY }: MouseEvent, { left, top, width, height }: ClientRect): string {
    const cx: number = left + width / 2;
    const cy: number = top + height / 2;
    const dx: number = clientX - cx;
    const dy: number = clientY - cy;

    const tiltX: number = (-dy / cy) * 2;
    const tiltY: number = (dx / cx) * 2;
    const radius: number = Math.sqrt(Math.pow(tiltX, 2) + Math.pow(tiltY, 2));
    const degree: number = radius * 20;

    return `rotate3d(${tiltX}, ${tiltY}, 0, ${degree}deg)`;
  }
}
