import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { PopoverComponentBase } from '@bimeister/pupakit.overlays';

@Component({
  selector: 'demo-popover-layout',
  templateUrl: './popover-layout.component.html',
  styleUrls: ['./popover-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PopoverLayoutComponent extends PopoverComponentBase<string[], void> {
  public readonly tags: string[] = this.data ?? [];
}
