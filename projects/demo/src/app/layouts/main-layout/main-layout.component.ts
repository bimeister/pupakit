import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AnchorService } from '../../common/services/anchor.service';

@Component({
  selector: 'demo-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  providers: [AnchorService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {}
