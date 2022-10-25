import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnChanges,
  SimpleChanges,
  Renderer2,
  SimpleChange,
} from '@angular/core';
import { DaySelectorSize } from '../../../../declarations/types/day-selector-size.type';
import { isNil } from '@bimeister/utilities';

@Component({
  selector: 'pupa-day-selector-item',
  templateUrl: './day-selector-item.component.html',
  styleUrls: ['./day-selector-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaySelectorItemComponent implements OnChanges {
  @Input() public name: string;
  @Input() public size: DaySelectorSize;

  @Input() public selected: boolean = false;
  @Output() public readonly selectedStateChange: EventEmitter<void> = new EventEmitter<void>();

  @Input() public disabled: boolean = false;

  constructor(private readonly hostElement: ElementRef, private readonly renderer: Renderer2) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const size: SimpleChange = changes.size;
    if (!isNil(size) && size.previousValue !== size.currentValue) {
      const element: HTMLElement = this.hostElement.nativeElement;
      this.renderer.removeClass(element, size.previousValue);
      this.renderer.addClass(element, size.currentValue);
    }
  }

  public onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    if (this.disabled) {
      return;
    }
    this.selectedStateChange.next();
  }

  public onKeyDown(event: KeyboardEvent): void {
    const ENTER_EVENT_CODE: string = 'Enter';
    if (this.disabled || event.code !== ENTER_EVENT_CODE) {
      return;
    }
    this.selectedStateChange.next();
  }
}
