import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { DrawerRef, Theme, ThemeWrapperService } from '../../../../../../src/public-api';
import { DRAWER_DATA_TOKEN } from '../../../../../declarations/tokens/drawer-data.token';
import { Observable } from 'rxjs';

@Component({
  selector: 'demo-test-drawer-new',
  templateUrl: './test-drawer-new.component.html',
  styleUrls: ['./test-drawer-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestDrawerNewComponent implements OnInit {
  public readonly theme$: Observable<Theme> = this.themeWrapperService.theme$;

  constructor(
    @Inject(DrawerRef) private readonly drawerRef: DrawerRef<number>,
    @Inject(DRAWER_DATA_TOKEN) private readonly data: number,
    private readonly themeWrapperService: ThemeWrapperService
  ) {}

  public ngOnInit(): void {
    // tslint:disable-next-line: no-console
    console.log(this.drawerRef);
    // tslint:disable-next-line: no-console
    console.log(this.data);
  }
}
