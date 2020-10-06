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
import { SelectNewStateService } from '../../../services/select-new-state.service';

@Component({
  selector: 'pupa-select-new-table',
  templateUrl: './select-new-table.component.html',
  styleUrls: ['./select-new-table.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SelectNewStateService]
})
export class SelectNewTableComponent<T> extends SelectBase<T> implements OnChanges, ControlValueAccessor {
  @Input() public isMultiSelectionEnabled: boolean = false;

  constructor(
    selectNewStateService: SelectNewStateService<T>,
    elementRef: ElementRef<HTMLElement>,
    @Optional() ngControl: NgControl
  ) {
    super(selectNewStateService, elementRef, ngControl);
  }

  @HostListener('window:resize', ['$event'])
  @HostListener('window:touchstart', ['$event'])
  @HostListener('window:click', ['$event'])
  @HostListener('window:wheel', ['$event'])
  public closeOnOuterEvents(event: Event): void {
    this.processCloseEvent(event);
  }
}
