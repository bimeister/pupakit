import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[pupaDndStartTrigger]',
})
export class DndStartTriggerDirective {
  constructor(public readonly elementRef: ElementRef) {}
}
