import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-pupa-tag-delete-button',
  templateUrl: './pupa-tag-delete-button.component.html',
  styleUrls: ['./pupa-tag-delete-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagDeleteButtonComponent {
  @Output() public readonly close: EventEmitter<void> = new EventEmitter();

  public closeHandler(): void {
    this.close.emit();
  }
}
