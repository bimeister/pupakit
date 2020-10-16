import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { isEmpty, isNil } from '@meistersoft/utilities';

@Component({
  selector: 'pupa-modal-layout',
  templateUrl: './modal-layout.component.html',
  styleUrls: ['./modal-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalLayoutComponent {
  @Output() public readonly closeButtonClicked: EventEmitter<void> = new EventEmitter();

  @Input() public title: string = '';
  @Input() public isCloseButtonVisible: boolean = false;

  public get isTitleVisible(): boolean {
    return !isNil(this.title) && !isEmpty(this.title);
  }

  public get isHeaderVisible(): boolean {
    return this.isTitleVisible || this.isCloseButtonVisible;
  }

  public processCloseButtonClick(): void {
    this.closeButtonClicked.emit();
  }
}
