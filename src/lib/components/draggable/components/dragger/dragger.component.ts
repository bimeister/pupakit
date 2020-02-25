import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pupa-dragger',
  templateUrl: './dragger.component.html',
  styleUrls: ['./dragger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggerComponent {}
