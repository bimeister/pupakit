import { Directive, Input, OnChanges } from '@angular/core';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { filterTruthy, isNil } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TagStateServiceDeclaration } from '../../interfaces/tag-state-service.interface';
import { TagKind } from '../../types/tag-kind.type';

@Directive()
export abstract class TagBase implements OnChanges {
  @Input() public disabled: boolean = false;
  public readonly isDisabled$: BehaviorSubject<boolean> = this.tagStateService.isDisabled$;

  @Input() public clickable: boolean = false;
  public readonly isClickable$: BehaviorSubject<boolean> = this.tagStateService.isClickable$;

  @Input() public kind: TagKind = 'opacity';
  private readonly kind$: BehaviorSubject<TagKind> = this.tagStateService.kind$;

  public readonly kindClass$: Observable<string> = this.kind$.pipe(map((kind: TagKind) => `tag_${kind}`));
  public readonly isInteractive$: Observable<boolean> = combineLatest([
    this.tagStateService.isDisabled$,
    this.tagStateService.isClickable$,
  ]).pipe(map(([isDisabled, isClickable]: [boolean, boolean]) => !isDisabled && isClickable));

  constructor(protected readonly tagStateService: TagStateServiceDeclaration) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processDisabledChange(changes?.disabled);
    this.processClickableChange(changes?.clickable);
    this.processColorChange(changes?.kind);
  }

  public processInteraction(event: Event): void {
    this.isDisabled$.pipe(take(1), filterTruthy()).subscribe(() => {
      event.stopPropagation();
    });
  }

  private processDisabledChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isDisabled$.next(updatedValue);
  }

  private processClickableChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isClickable$.next(updatedValue);
  }

  private processColorChange(change: ComponentChange<this, TagKind>): void {
    const updatedValue: TagKind | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.kind$.next(updatedValue);
  }
}
