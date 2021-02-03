import { Component, EventEmitter, Input, Output } from '@angular/core';
import { isEmpty, isNil } from '@bimeister/utilities';

@Component({
  selector: 'pupa-drawer-layout',
  templateUrl: './drawer-layout.component.html',
  styleUrls: ['./drawer-layout.component.scss']
})
export class DrawerLayoutComponent {
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
