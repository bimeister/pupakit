import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Inject,
  ViewEncapsulation
} from '@angular/core';
import { DRAWER_LAYOUT_CONFIG_TOKEN } from '../../../../../internal/constants/tokens/drawer-layout-data.token';
import { DrawerLayoutConfig } from '../../../../../internal/declarations/interfaces/drawer-layout-config.interface';
import { DrawerLayoutFooterNewComponent } from '../drawer-layout-footer-new/drawer-layout-footer-new.component';
import { BehaviorSubject } from 'rxjs';
import { isNil, Nullable } from '@bimeister/utilities';

@Component({
  selector: 'pupa-drawer-layout-new',
  templateUrl: './drawer-layout-new.component.html',
  styleUrls: ['./drawer-layout-new.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerLayoutNewComponent implements AfterContentInit {
  @ContentChild(DrawerLayoutFooterNewComponent) public footerComponent: Nullable<DrawerLayoutFooterNewComponent>;
  public readonly isFooterComponentExists$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public get hasShadow(): boolean {
    return !this.drawerLayoutConfig.hasBackdrop;
  }

  constructor(@Inject(DRAWER_LAYOUT_CONFIG_TOKEN) private readonly drawerLayoutConfig: DrawerLayoutConfig) {}

  public ngAfterContentInit(): void {
    this.isFooterComponentExists$.next(isNil(this.footerComponent));
  }
}
