import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { remSizePx } from './../../../constants/rem-size-px.const';
import { isNullOrUndefined } from './../../../helpers/is-null-or-undefined.helper';

export enum ControlState {
  expanded = 'true',
  collapsed = 'false'
}

export type SearchFieldKind = 'solid' | 'outlined';

@Component({
  selector: 'pupa-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('controlExpanded', [
      // tslint:disable: no-magic-numbers
      state('false', style({ width: `${2.8125 * remSizePx}px` })),
      state('true', style({ width: `100%` })),
      // tslint:enable: no-magic-numbers
      transition('false => true', animate('0.32s cubic-bezier(0.97, 0.84, .03, 0.95)')),
      transition('true => false', animate('0.2s ease-in-out'))
    ])
  ]
})
export class SearchFieldComponent {
  @ViewChild('inputElement', { static: true }) public inputElement: ElementRef<HTMLInputElement>;
  public controlExpansionState$: BehaviorSubject<ControlState> = new BehaviorSubject<ControlState>(
    ControlState.collapsed
  );
  @Input() public placeholder: string = '';
  @Input() public expandable: boolean = false;
  @Input() public kind: SearchFieldKind = 'solid';
  @HostBinding('class.pupa-search-field_expandable')
  public get isExoandable(): boolean {
    return this.expandable;
  }
  public inputValueControl: FormControl = new FormControl(null);

  public get buttonIconName(): string {
    if (this.expandable) {
      return this.controlExpansionState$.getValue() === ControlState.expanded ? 'close' : 'search';
    }
    return !this.isValueEmpty ? 'close' : 'search';
  }

  public get isValueEmpty(): boolean {
    return isNullOrUndefined(this.inputValueControl.value) || String(this.inputValueControl.value).length === 0;
  }

  public switchState(event: Event): void {
    event.stopPropagation();
    switch (this.expandable) {
      case true: {
        const currentValue: ControlState = this.controlExpansionState$.getValue();
        if (currentValue === ControlState.expanded) {
          this.inputElement.nativeElement.blur();
          this.controlExpansionState$.next(ControlState.collapsed);
          this.inputValueControl.reset();
          return;
        }
        this.controlExpansionState$.next(ControlState.expanded);
        this.inputElement.nativeElement.focus();
        return;
      }
      case false: {
        if (!this.isValueEmpty) {
          this.inputValueControl.reset();
          this.inputElement.nativeElement.blur();
          return;
        }
        this.inputElement.nativeElement.focus();
        return;
      }
      default: {
        return;
      }
    }
  }
}
