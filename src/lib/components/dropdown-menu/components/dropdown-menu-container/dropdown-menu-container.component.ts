import { Component, ViewEncapsulation, ChangeDetectionStrategy, Injector, TemplateRef } from '@angular/core';
import { DropdownMenuService } from '../../services/dropdown-menu.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DROPDOWN_CONTEXT_ID_TOKEN } from '../../constants/tokens/dropdown-context-id.token';
import { Uuid } from '../../../../../internal/declarations/types/uuid.type';
import { Observable } from 'rxjs';
import { Nullable } from '@bimeister/utilities';
import { map } from 'rxjs/operators';

const ANIMATION_DURATION_MS: number = 150;

enum AnimationStates {
  SHOW = 'show',
  VOID = 'void'
}

@Component({
  selector: 'pupa-dropdown-menu-container',
  templateUrl: './dropdown-menu-container.component.html',
  styleUrls: ['./dropdown-menu-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('dropdownShow', [
      state(AnimationStates.VOID, style({ transform: 'translateY(10px)', opacity: 0 })),
      state(AnimationStates.SHOW, style({ transform: 'translateY(0px)', opacity: 1 })),
      transition(`${AnimationStates.VOID} => ${AnimationStates.SHOW}`, [animate(`${ANIMATION_DURATION_MS}ms ease-in`)]),
      transition(`${AnimationStates.SHOW} => ${AnimationStates.VOID}`, [animate(`${ANIMATION_DURATION_MS}ms ease-out`)])
    ])
  ]
})
export class DropdownMenuContainerComponent {
  public readonly dropdownMenuService: DropdownMenuService;
  public readonly contextId: Uuid;

  public readonly contentTemplate$: Observable<Nullable<TemplateRef<unknown>>>;

  public readonly isOpen$: Observable<boolean>;

  public readonly animationState$: Observable<AnimationStates>;

  constructor(private readonly injector: Injector) {
    this.dropdownMenuService = this.injector.get(DropdownMenuService);
    this.contextId = this.injector.get(DROPDOWN_CONTEXT_ID_TOKEN);

    this.contentTemplate$ = this.dropdownMenuService.getDropdownTemplate(this.contextId);
    this.isOpen$ = this.dropdownMenuService.getDropdownIsOpen(this.contextId);
    this.animationState$ = this.isOpen$.pipe(
      map((isOpen: boolean) => (isOpen ? AnimationStates.SHOW : AnimationStates.VOID))
    );
  }
}
