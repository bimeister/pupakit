import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { PupaAccordionActionTemplateDirective } from '../../directives/accordion-action-template.directive';
import { AccordionKind } from '../../../../declarations/types/accordion-kind.type';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';

enum AnimationState {
  Void = 'void',
  Expanded = 'expanded',
}

const TRANSITION: string = '300ms ease-in-out';

@Component({
  selector: 'pupa-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('accordionExpanded', [
      state(AnimationState.Void, style({ opacity: '0', height: '0px', visibility: 'hidden', overflow: 'hidden' })),
      state(AnimationState.Expanded, style({ height: '*', overflow: 'hidden' })),
      transition(`${AnimationState.Expanded} => ${AnimationState.Void}`, animate(TRANSITION)),
      transition(`${AnimationState.Void} => ${AnimationState.Expanded}`, animate(TRANSITION)),
    ]),
    trigger('arrowRotated', [
      state(AnimationState.Void, style({ transform: 'rotate(0)' })),
      state(AnimationState.Expanded, style({ transform: 'rotate(180deg)' })),
      transition(`${AnimationState.Expanded} => ${AnimationState.Void}`, animate(TRANSITION)),
      transition(`${AnimationState.Void} => ${AnimationState.Expanded}`, animate(TRANSITION)),
    ]),
  ],
})
export class AccordionComponent implements OnChanges {
  @ContentChild(PupaAccordionActionTemplateDirective)
  public readonly actionTemplate: PupaAccordionActionTemplateDirective;

  @Input() public showArrow: boolean = true;

  @Input() public destroyable: boolean = true;

  @Input() public stickyHeader: boolean = false;

  @Input() public kind: AccordionKind = 'normal';
  public readonly kind$: BehaviorSubject<AccordionKind> = new BehaviorSubject<AccordionKind>(this.kind);

  @Input() public expanded: boolean = false;
  @Output() public readonly expandedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  public readonly expanded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.expanded);

  public readonly animationState$: Observable<AnimationState> = this.expanded$.pipe(
    map((expanded: boolean) => (expanded ? AnimationState.Expanded : AnimationState.Void))
  );

  public readonly accordionClass$: Observable<string> = this.kind$.pipe(
    map((kind: AccordionKind) => `pupa-accordion_${kind}`)
  );

  constructor(private readonly changeDetectionRef: ChangeDetectorRef) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (changes.hasOwnProperty('kind')) {
      this.processKindChange(changes.kind);
    }

    if (changes.hasOwnProperty('expanded')) {
      this.processExpandedChange(changes.expanded);
    }
  }

  public toggle(): void {
    this.updateExpanded(!this.expanded);
  }

  public expand(): void {
    this.updateExpanded(true);
  }

  public collapse(): void {
    this.updateExpanded(false);
  }

  private updateExpanded(expanded: boolean): void {
    if (this.expanded === expanded) {
      return;
    }

    this.expanded = expanded;
    this.expandedChange.emit(expanded);
    this.expanded$.next(expanded);
    this.changeDetectionRef.detectChanges();
  }

  private processExpandedChange(expanded: ComponentChange<this, boolean>): void {
    this.expanded$.next(expanded.currentValue);
  }

  private processKindChange(kind: ComponentChange<this, AccordionKind>): void {
    this.kind$.next(kind.currentValue);
  }
}
