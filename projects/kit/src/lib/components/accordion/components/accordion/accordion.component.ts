import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  @Input() public readonly showArrow: boolean = true;

  @Input() public destroyable: boolean = true;

  @Input() public expanded: boolean = false;
  @Output() public readonly expandedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  public readonly expanded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.expanded);

  public readonly animationState$: Observable<AnimationState> = this.expanded$.pipe(
    map((expanded: boolean) => (expanded ? AnimationState.Expanded : AnimationState.Void))
  );

  constructor(private readonly changeDetectionRef: ChangeDetectorRef) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (isNil(changes)) {
      return;
    }
    this.processExpandedChange(changes?.expanded);
  }

  public toggle(): void {
    this.updateExpanded(!this.expanded);
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

  private processExpandedChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.expanded$.next(updatedValue);
  }
}
