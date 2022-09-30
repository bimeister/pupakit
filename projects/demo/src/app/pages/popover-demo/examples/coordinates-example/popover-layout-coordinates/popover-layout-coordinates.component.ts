import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PopoverComponentBase } from '@kit/internal/declarations/classes/abstract/popover-component-base.abstract';
import { PopoverRef } from '@kit/internal/declarations/classes/popover-ref.class';

interface PopoverContentData {
  fruits: string[];
}

@Component({
  selector: 'demo-popover-layout-coordinates',
  templateUrl: './popover-layout-coordinates.component.html',
  styleUrls: ['./popover-layout-coordinates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PopoverLayoutCoordinatesComponent extends PopoverComponentBase<PopoverContentData, void> {
  public readonly fruits: string[] = this.data.fruits ?? [];
  public readonly control: FormControl = new FormControl([]);

  constructor(public readonly popoverRef: PopoverRef<PopoverContentData, void>) {
    super(popoverRef);
  }
}
