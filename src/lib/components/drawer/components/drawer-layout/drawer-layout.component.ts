import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { DRAWER_LAYOUT_CONFIG_TOKEN } from '../../../../../internal/constants/tokens/drawer-layout-data.token';
import { DrawerLayoutConfig } from '../../../../../internal/declarations/interfaces/drawer-layout-config.interface';
import { DrawerLayoutFooterComponent } from '../drawer-layout-footer/drawer-layout-footer.component';

@Component({
  selector: 'pupa-drawer-layout',
  templateUrl: './drawer-layout.component.html',
  styleUrls: ['./drawer-layout.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerLayoutComponent implements AfterContentInit {
  @ContentChild(DrawerLayoutFooterComponent) public footerComponent: Nullable<DrawerLayoutFooterComponent>;
  public readonly isFooterComponentExists$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public get hasShadow(): boolean {
    return !this.drawerLayoutConfig.hasBackdrop;
  }

  constructor(@Inject(DRAWER_LAYOUT_CONFIG_TOKEN) private readonly drawerLayoutConfig: DrawerLayoutConfig) {}

  public ngAfterContentInit(): void {
    this.isFooterComponentExists$.next(isNil(this.footerComponent));
  }
}
