import { Component, EventEmitter, Input, Output } from '@angular/core';
import { isEmpty, isNil } from '@bimeister/utilities';

@Component({
  selector: 'pupa-drawer-layout-old',
  templateUrl: './drawer-layout-old.component.html',
  styleUrls: ['./drawer-layout-old.component.scss']
})
export class DrawerLayoutOldComponent {
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
