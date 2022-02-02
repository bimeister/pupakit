import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'demo-menu-toggle',
  templateUrl: './menu-toggle.component.html',
  styleUrls: ['./menu-toggle.component.scss'],
})
export class MenuToggleComponent {
  @Input() public isOpen: boolean = false;

  @Output() public readonly toggle: EventEmitter<boolean> = new EventEmitter();

  public handleToggle(): void {
    this.toggle.emit(!this.isOpen);
  }
}
