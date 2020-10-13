import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  Optional,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

import { SelectBase } from '../../../../../../internal/declarations/classes/abstract/select-base.abstract';
import { SelectStateService } from '../../../services/select-state.service';

@Component({
  selector: 'pupa-select-table',
  templateUrl: './select-table.component.html',
  styleUrls: ['./select-table.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SelectStateService]
})
export class SelectTableComponent<T> extends SelectBase<T> implements OnChanges, ControlValueAccessor {
  @Input() public isMultiSelectionEnabled: boolean = false;
  @Input() public isUnselectionEnabled: boolean = false;

  constructor(
    selectStateService: SelectStateService<T>,
    elementRef: ElementRef<HTMLElement>,
    @Optional() ngControl: NgControl
  ) {
    super(selectStateService, elementRef, ngControl);
  }

  @HostListener('window:resize', ['$event'])
  @HostListener('window:touchstart', ['$event'])
  @HostListener('window:click', ['$event'])
  @HostListener('window:wheel', ['$event'])
  public closeOnOuterEvents(event: Event): void {
    this.processCloseEvent(event);
  }
}
