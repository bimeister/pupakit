import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { DrawerFloat } from '../layout/drawers.service';

@Component({
  selector: 'pupa-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('drawerExpanded', [
      state('false', style({ width: `0` })),
      state('true', style({ width: `*` })),
      transition('false => true', animate('0.32s cubic-bezier(0.97, 0.84, .03, 0.95)')),
      transition('true => false', animate('0.2s ease-in-out'))
    ])
  ]
})
export class DrawerComponent {
  @Input()
  public isVisible: string = 'false';

  @Input()
  public float: DrawerFloat = 'right';

  @Output()
  public animationDone: EventEmitter<boolean> = new EventEmitter<boolean>();

  public processAnimationEnd(event: AnimationEvent): void {
    const animationDone: boolean = String(event.toState) === 'false';
    if (!animationDone) {
      return;
    }
    this.animationDone.emit(animationDone);
  }
}
