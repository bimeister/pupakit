import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Theme, ThemeWrapperService } from '../../../../../../../src/public-api';

@Component({
  selector: 'demo-test-drawer',
  templateUrl: './test-drawer.component.html',
  styleUrls: ['./test-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestDrawerComponent {
  public readonly theme$: Observable<Theme> = this.themeWrapperService.theme$;

  constructor(private readonly themeWrapperService: ThemeWrapperService) {}
}
