import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { PopoverComponentBase, PopoverRef } from '@bimeister/pupakit.overlays';

interface PopoverContentData {
  title: string;
  buttonAction: VoidFunction;
}

@Component({
  selector: 'demo-popover-layout-basic',
  templateUrl: './popover-layout-basic.component.html',
  styleUrls: ['./popover-layout-basic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PopoverLayoutBasicComponent extends PopoverComponentBase<PopoverContentData, void> {
  public readonly title: string = this.data.title ?? '';

  constructor(public readonly popoverRef: PopoverRef<PopoverContentData, void>) {
    super(popoverRef);
  }

  public buttonClick(): void {
    this.data.buttonAction();
  }
}
