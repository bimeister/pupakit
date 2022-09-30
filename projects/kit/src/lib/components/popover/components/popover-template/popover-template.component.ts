import { ChangeDetectionStrategy, Component, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Nullable } from '@bimeister/utilities';
import { PopoverComponentBase } from '../../../../../internal/declarations/classes/abstract/popover-component-base.abstract';
import { PopoverRef } from '../../../../../internal/declarations/classes/popover-ref.class';
import { PopoverTemplateData } from '../../../../../internal/declarations/interfaces/popover-template-data.interface';

@Component({
  selector: 'pupa-popover-template',
  templateUrl: './popover-template.component.html',
  styleUrls: ['./popover-template.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverTemplateComponent<TContext> extends PopoverComponentBase<PopoverTemplateData<TContext>, void> {
  public readonly templateRef: Nullable<TemplateRef<unknown>> = this.data.templateRef;
  public readonly templateContext: TContext = {
    ...this.data.templateContext,
    popoverRef: this.popoverRef,
  };

  constructor(popoverRef: PopoverRef<PopoverTemplateData<TContext>, void>) {
    super(popoverRef);
  }
}
