import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Theme } from '../../../../../../../src/internal/declarations/enums/theme.enum';
import { ThemeWrapperService } from '../../../../../../../src/lib/components/theme-wrapper/services/theme-wrapper.service';

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
