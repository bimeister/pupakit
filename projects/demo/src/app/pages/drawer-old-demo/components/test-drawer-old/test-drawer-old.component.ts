import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { DrawerRef } from '../../../../../../../src/public-api';
import { DRAWER_DATA_TOKEN } from '../../../../../declarations/tokens/drawer-data.token';

@Component({
  selector: 'demo-test-drawer-old',
  templateUrl: './test-drawer-old.component.html',
  styleUrls: ['./test-drawer-old.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestDrawerOldComponent implements OnInit {
  constructor(
    @Inject(DrawerRef) private readonly drawerRef: DrawerRef<number>,
    @Inject(DRAWER_DATA_TOKEN) private readonly data: number
  ) {}

  public ngOnInit(): void {
    // eslint-disable-next-line no-console
    console.log(this.drawerRef);
    // eslint-disable-next-line no-console
    console.log(this.data);
  }

  public close(): void {
    this.drawerRef.close(666);
  }
}
