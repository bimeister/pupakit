import { DndItemHtmlElement } from '../interfaces/dnd-item-html-element.interface';

function isDndItemHtmlElement(target: EventTarget): target is DndItemHtmlElement {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return target.dataset.dndItemId !== undefined;
}

export function getDndTargetItemFromEvent(event: Event): DndItemHtmlElement | null {
  const eventTargets: EventTarget[] = event.composedPath();

  for (const target of eventTargets) {
    if (isDndItemHtmlElement(target)) {
      return target;
    }
  }

  return null;
}
