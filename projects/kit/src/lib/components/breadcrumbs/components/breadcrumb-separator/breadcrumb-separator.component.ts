import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-breadcrumb-separator',
  templateUrl: './breadcrumb-separator.component.html',
  styleUrls: ['./breadcrumb-separator.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbSeparatorComponent {}
