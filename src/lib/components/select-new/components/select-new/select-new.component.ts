import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewEncapsulation } from '@angular/core';

import { isNullOrUndefined } from '../../../../../internal/api';
import { SelectNewStateService } from '../../services/select-new-state.service';

@Component({
  selector: 'pupa-select-new',
  templateUrl: './select-new.component.html',
  styleUrls: ['./select-new.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SelectNewStateService]
})
export class SelectNewComponent {
  constructor(
    private readonly selectNewStateService: SelectNewStateService,
    private readonly elementRef: ElementRef<HTMLElement>
  ) {}

  @HostListener('window:click', ['$event'])
  public processClick(event: MouseEvent): void {
    const target: EventTarget = event.target;
    const currentElement: Element = this.elementRef.nativeElement;

    if (!SelectNewComponent.targetExistsInCurrentElementChildren(target, currentElement)) {
      this.selectNewStateService.collapse();
    }
  }

  private static targetExistsInCurrentElementChildren(target: EventTarget, currentElement: Element): boolean {
    if (target instanceof Element) {
      return SelectNewComponent.allElementChildren(currentElement).includes(target);
    }

    return false;
  }

  private static allElementChildren(currentElement: Element, extractedChildren: Element[] = []): Element[] {
    if (isNullOrUndefined(currentElement)) {
      return extractedChildren;
    }

    const currentLevelChildren: Element[] = Array.from(currentElement.children);
    const nestedLevelsChildren: Element[] = currentLevelChildren
      .map((element: Element) => SelectNewComponent.allElementChildren(element, currentLevelChildren))
      .flat(1);

    return [...extractedChildren, ...nestedLevelsChildren];
  }
}
