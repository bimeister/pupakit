import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { DrawersService } from '../../../src/public-api';
import { TestDrawerComponent } from './components/test-drawer/test-drawer.component';
import { FormControl, FormGroup } from '@angular/forms';
import { DRAWER_DATA_TOKEN } from '../../declarations/tokens/drawer-data.token';
import { RadioOption } from '../example-viewer/radio-option';

@Component({
  selector: 'demo-drawer-demo',
  templateUrl: './drawer-demo.component.html',
  styleUrls: ['./drawer-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerDemoComponent {
  public readonly formGroup: FormGroup = new FormGroup({
    hasBackdrop: new FormControl(true),
    closeOnBackdropClick: new FormControl(true),
    isBackdropTransparent: new FormControl(false),
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
    this.drawerService.open(TestDrawerComponent, {
      ...this.formGroup.value,
      injector: this.injector,
      viewportMarginPx: 10,
      providers: [
        {
          provide: DRAWER_DATA_TOKEN,
          useValue: [1, 2, 3, 4]
        }
      ]
    });
  }
}
