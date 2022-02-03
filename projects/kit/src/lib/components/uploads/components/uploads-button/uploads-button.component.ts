import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-uploads-button',
  templateUrl: './uploads-button.component.html',
  styleUrls: ['./uploads-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadsButtonComponent {
  @Input() public isActive: boolean = false;
  @Input() public isDisable: boolean = false;
}
