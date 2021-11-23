import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { TestDrawerOldComponent } from './components/test-drawer-old/test-drawer-old.component';
import { FormControl, FormGroup } from '@angular/forms';
import { RadioOption } from '../../shared/components/example-viewer/radio-option';
import { DrawersService } from '../../../../src/internal/shared/services/drawers.service';
import { DRAWER_DATA_TOKEN } from '../../../declarations/tokens/drawer-data.token';

@Component({
  selector: 'demo-drawer-old-demo',
  templateUrl: './drawer-old-demo.component.html',
  styleUrls: ['./drawer-old-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerOldDemoComponent {
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
    this.drawerService.open(TestDrawerOldComponent, {
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
