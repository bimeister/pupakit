import { ChangeDetectionStrategy, Component, Input, Optional, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Nullable } from '@bimeister/utilities';
import { SelectBase } from '../../../../declarations/classes/abstract/select-base.abstract';
import { SelectSize } from '../../../../declarations/types/select-size.type';
import { SelectStateService } from '../../services/select-state.service';

@Component({
  selector: 'pupa-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SelectStateService],
})
export class SelectComponent<T> extends SelectBase<T> {
  @Input() public isMultiSelectionEnabled: boolean = false;
  @Input() public isUnselectionEnabled: boolean = false;
  @Input() public isPatched: boolean = false;
  @Input() public placeholder: Nullable<string> = null;

  @Input() public withReset: boolean = false;
  @Input() public inline: boolean = false;
  @Input() public size: SelectSize = 'medium';

  @Input() public invalidTooltipHideOnHover: boolean = false;
  @Input() public invalidTooltipDisabled: boolean = false;
  @Input() public invalidTooltip: Nullable<string> = null;
  @Input() public invalidTooltipContentTemplate: Nullable<TemplateRef<unknown>> = null;

  constructor(selectStateService: SelectStateService<T>, @Optional() ngControl: NgControl) {
    super(selectStateService, ngControl);
  }

  public close(): void {
    this.processCloseEvent();
  }
}
