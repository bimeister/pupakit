import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Theme } from '../../../../../../../../src/internal/declarations/enums/theme.enum';
import { ThemeWrapperService } from '../../../../../../../../src/lib/components/theme-wrapper/services/theme-wrapper.service';

@Component({
  selector: 'demo-drawer-layout-example-1',
  templateUrl: './drawer-layout-example-1.component.html',
  styleUrls: ['./drawer-layout-example-1.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerLayoutExample1Component {
  public readonly tabs: { name: string; title: string; text: string }[] = [
    { name: 'tab 1', title: 'Pupa', text: 'Pupa tab' },
    { name: 'tab 2', title: 'Lupa', text: 'Lupa tab' },
    { name: 'tab 3', title: 'Zupa', text: 'Zupa tab' },
    { name: 'tab 4', title: 'Dupa', text: 'Dupa tab' },
  ];

  public readonly theme$: Observable<Theme> = this.themeWrapperService.theme$;

  constructor(private readonly themeWrapperService: ThemeWrapperService) {}
}
