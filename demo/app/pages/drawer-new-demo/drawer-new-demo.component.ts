import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { TestDrawerNewComponent } from './components/test-drawer-new/test-drawer-new.component';
import { FormControl, FormGroup } from '@angular/forms';
import { RadioOption } from '../../shared/components/example-viewer/radio-option';
import { DrawersService } from '../../../../src/internal/shared/services/drawers.service';
import { DRAWER_DATA_TOKEN } from '../../../declarations/tokens/drawer-data.token';
import { DrawerContainerNewComponent } from '../../../../src/lib/components/drawer-new/components/drawer-container-new/drawer-container-new.component';

const BASE_REQUEST_PATH: string = 'drawer-new-demo/examples';

@Component({
  selector: 'demo-drawer-demo',
  templateUrl: './drawer-new-demo.component.html',
  styleUrls: ['./drawer-new-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerNewDemoComponent {
  public readonly example1Content: Record<string, string> = {
    'drawer-layout-example-1.component.html': `${BASE_REQUEST_PATH}/example-1/drawer-layout-example-1/drawer-layout-example-1.component.html`,
    'drawer-layout-example-1.component.ts': `${BASE_REQUEST_PATH}/example-1/drawer-layout-example-1/drawer-layout-example-1.component.ts`,
    'drawer-trigger-example-1.component.html': `${BASE_REQUEST_PATH}/example-1/drawer-trigger-example-1/drawer-trigger-example-1.component.html`,
    'drawer-trigger-example-1.component.ts': `${BASE_REQUEST_PATH}/example-1/drawer-trigger-example-1/drawer-trigger-example-1.component.ts`
  };

  public readonly formGroup: FormGroup = new FormGroup({
    hasBackdrop: new FormControl(true),
    closeOnBackdropClick: new FormControl(true),
    isBackdropTransparent: new FormControl(false),
    hasPadding: new FormControl(true),
    float: new FormControl('right')
  });

  public readonly floatOptions: RadioOption[] = [
    {
      caption: 'Left',
      value: 'left'
    },
    {
      caption: 'Right',
      value: 'right',
      isDefault: true
    }
  ];

  constructor(private readonly drawerService: DrawersService, private readonly injector: Injector) {}

  public openDrawer(): void {
    this.drawerService.open(TestDrawerNewComponent, {
      ...this.formGroup.value,
      injector: this.injector,
      viewportMarginPx: 10,
      containerComponent: DrawerContainerNewComponent,
      providers: [
        {
          provide: DRAWER_DATA_TOKEN,
          useValue: [1, 2, 3, 4]
        }
      ]
    });
  }
}
