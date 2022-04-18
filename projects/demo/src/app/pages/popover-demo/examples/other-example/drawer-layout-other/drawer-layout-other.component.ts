import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Theme } from '@kit/internal/declarations/enums/theme.enum';
import { ThemeWrapperService } from '@kit/lib/components/theme-wrapper/services/theme-wrapper.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'demo-drawer-layout-other',
  templateUrl: './drawer-layout-other.component.html',
  styleUrls: ['./drawer-layout-other.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerLayoutOtherComponent {
  public readonly theme$: Observable<Theme> = this.themeWrapperService.theme$;

  constructor(private readonly themeWrapperService: ThemeWrapperService) {}
}
