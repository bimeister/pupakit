import { DndHostHtmlElement } from '../interfaces/dnd-host-html-element.interface';

function isDndHostElement(target: EventTarget): target is DndHostHtmlElement {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return target.dataset.dndHostId !== undefined;
}

export function getDndHostElementFromEvent(event: Event): DndHostHtmlElement | null {
  const eventTargets: EventTarget[] = event.composedPath();

  for (const target of eventTargets) {
    if (isDndHostElement(target)) {
      return target;
    }
  }

  return null;
}
