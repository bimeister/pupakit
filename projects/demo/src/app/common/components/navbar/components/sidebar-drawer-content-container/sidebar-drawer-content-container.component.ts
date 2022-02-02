import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Theme } from '@kit/internal/declarations/enums/theme.enum';
import { ThemeWrapperService } from '@kit/lib/components/theme-wrapper/services/theme-wrapper.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'demo-sidebar-drawer-content-container',
  templateUrl: './sidebar-drawer-content-container.component.html',
  styleUrls: ['./sidebar-drawer-content-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarDrawerContentContainerComponent {
  public readonly theme$: Observable<Theme> = this.themeWrapperService.theme$;

  constructor(private readonly themeWrapperService: ThemeWrapperService) {}
}
