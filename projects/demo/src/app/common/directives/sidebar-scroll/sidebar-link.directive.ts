import { AfterViewInit, Directive, ElementRef, HostListener, Inject, Input, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { DrawerRef } from '@bimeister/pupakit.overlays';
import { isNil, Nullable } from '@bimeister/utilities';
import { SidebarScrollDelay } from '../../../../declarations/enums/sidebar-scroll-delay.enum';
import { SidebarScrollService } from '../../services/sidebar-scroll.service';

@Directive({
  selector: '[demoSidebarLink]',
})
export class SidebarLinkDirective implements AfterViewInit {
  @Input()
  public demoSidebarLink: string;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly router: Router,
    private readonly sidebarScrollService: SidebarScrollService,
    @Inject(DrawerRef) @Optional() private readonly drawerRef: DrawerRef<number>
  ) {}

  @HostListener('click')
  public clickLickHandler(): void {
    this.configureSidebarScroll(this.elementRef.nativeElement);
  }

  public ngAfterViewInit(): void {
    this.setActiveLink();
  }

  private setActiveLink(): void {
    const activeNode: Nullable<HTMLElement> = this.router.isActive(this.demoSidebarLink, {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
    })
      ? this.elementRef.nativeElement
      : null;
    const delay: SidebarScrollDelay = isNil(this.drawerRef) ? SidebarScrollDelay.Long : SidebarScrollDelay.Default;

    this.configureSidebarScroll(activeNode, delay);
  }

  private configureSidebarScroll(
    node: Nullable<HTMLElement>,
    delay: SidebarScrollDelay = SidebarScrollDelay.Default
  ): void {
    if (isNil(node)) {
      return;
    }
    this.sidebarScrollService.configureSidebarScroll(node, delay);
  }
}
