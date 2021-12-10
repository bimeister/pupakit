import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  Optional,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Nullable } from '@bimeister/utilities';
import { SelectBase } from '../../../../../internal/declarations/classes/abstract/select-base.abstract';
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
  @Input() public placeholderOnHover: boolean = true;

  @Input() public withReset: boolean = false;

  @Input() public invalidTooltipHideOnHover: boolean = false;
  @Input() public invalidTooltipDisabled: boolean = false;
  @Input() public invalidTooltip: Nullable<string> = null;
  @Input() public invalidTooltipContentTemplate: Nullable<TemplateRef<unknown>> = null;

  constructor(selectStateService: SelectStateService<T>, @Optional() ngControl: NgControl) {
    super(selectStateService, ngControl);
  }

  @HostListener('document:resize', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  @HostListener('document:mousedown', ['$event'])
  @HostListener('document:wheel', ['$event'])
  public closeOnOuterEvents(): void {
    this.processCloseEvent();
  }
}
