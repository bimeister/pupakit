import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Theme } from '../../../../../src/internal/declarations/enums/theme.enum';
import { DrawersService } from '../../../../../src/internal/shared/services/drawers.service';
import { DrawerContainerComponent } from '../../../../../src/lib/components/drawer/components/drawer-container/drawer-container.component';
import { ThemeWrapperService } from '../../../../../src/lib/components/theme-wrapper/services/theme-wrapper.service';
import { DRAWER_DATA_TOKEN } from '../../../declarations/tokens/drawer-data.token';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';
import { TestDrawerComponent } from './components/test-drawer/test-drawer.component';

const BASE_REQUEST_PATH: string = 'drawer-demo/examples';

@Component({
  selector: 'demo-drawer-demo',
  templateUrl: './drawer-demo.component.html',
  styleUrls: ['./drawer-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerDemoComponent {
  public readonly example1Content: Record<string, string> = {
    'drawer-layout-example-1.component.html': `${BASE_REQUEST_PATH}/example-1/drawer-layout-example-1/drawer-layout-example-1.component.html`,
    'drawer-layout-example-1.component.ts': `${BASE_REQUEST_PATH}/example-1/drawer-layout-example-1/drawer-layout-example-1.component.ts`,
    'drawer-trigger-example-1.component.html': `${BASE_REQUEST_PATH}/example-1/drawer-trigger-example-1/drawer-trigger-example-1.component.html`,
    'drawer-trigger-example-1.component.ts': `${BASE_REQUEST_PATH}/example-1/drawer-trigger-example-1/drawer-trigger-example-1.component.ts`,
  };

  public readonly formGroup: FormGroup = new FormGroup({
    hasBackdrop: new FormControl(true),
    closeOnBackdropClick: new FormControl(true),
    isBackdropTransparent: new FormControl(false),
    hasPadding: new FormControl(true),
    float: new FormControl('right'),
    isFullscreen: new FormControl(false),
  });

  public readonly floatOptions: PropsOption[] = [
    {
      caption: 'Right',
      value: 'right',
    },
    {
      caption: 'Left',
      value: 'left',
    },
  ];

  constructor(
    private readonly drawerService: DrawersService,
    private readonly injector: Injector,
    private readonly themeWrapperService: ThemeWrapperService
  ) {}

  public openDrawer(): void {
    this.themeWrapperService.theme$.pipe(take(1)).subscribe((theme: Theme) => {
      this.drawerService.open(TestDrawerComponent, {
        ...this.formGroup.value,
        injector: this.injector,
        viewportMarginPx: 10,
        containerComponent: DrawerContainerComponent,
        providers: [
          {
            provide: DRAWER_DATA_TOKEN,
            useValue: [1, 2, 3, 4],
          },
        ],
        theme,
      });
    });
  }
}
