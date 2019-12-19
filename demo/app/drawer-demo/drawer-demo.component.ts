import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-drawer-demo',
  templateUrl: './drawer-demo.component.html',
  styleUrls: ['./drawer-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerDemoComponent {
  public isDrawerVisible: boolean = false;
  public destroyContentOnClose: boolean = true;
  public withOverlay: boolean = true;
  public floatRight: boolean = true;
}
