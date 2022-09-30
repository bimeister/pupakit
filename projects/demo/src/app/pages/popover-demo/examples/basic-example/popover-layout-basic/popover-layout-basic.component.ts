import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { PopoverComponentBase } from '@kit/internal/declarations/classes/abstract/popover-component-base.abstract';
import { PopoverRef } from '@kit/internal/declarations/classes/popover-ref.class';

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
