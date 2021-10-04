import { Component, Inject, OnInit } from '@angular/core';
import { DrawerRef } from '../../../../../../src/internal/declarations/classes/drawer-ref.class';
import { DRAWER_DATA_TOKEN } from '../../../../../declarations/tokens/drawer-data.token';

@Component({
  selector: 'demo-menu-drawer',
  templateUrl: './menu-drawer.component.html',
  styleUrls: ['./menu-drawer.component.scss']
})
export class MenuDrawerComponent implements OnInit {
  constructor(
    @Inject(DrawerRef) private readonly drawerRef: DrawerRef<number>,
    @Inject(DRAWER_DATA_TOKEN) private readonly data: number
  ) {}

  public ngOnInit(): void {
    // tslint:disable-next-line: no-console
    console.log(this.drawerRef);
    // tslint:disable-next-line: no-console
    console.log(this.data);
  }

  public close(): void {
    this.drawerRef.close(666);
  }
}
