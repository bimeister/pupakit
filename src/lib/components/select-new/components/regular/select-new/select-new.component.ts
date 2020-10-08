import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  Optional,
  ViewEncapsulation
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { SelectNewStateService } from '../../../services/select-new-state.service';
import { SelectBase } from './../../../../../../internal/declarations/classes/abstract/select-base.abstract';

@Component({
  selector: 'pupa-select-new',
  templateUrl: './select-new.component.html',
  styleUrls: ['./select-new.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SelectNewStateService]
})
export class SelectNewComponent<T> extends SelectBase<T> {
  @Input() public isMultiSelectionEnabled: boolean = false;
  @Input() public isUnselectionEnabled: boolean = false;

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
