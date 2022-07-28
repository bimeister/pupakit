import { ChangeDetectionStrategy, Component, ContentChild, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { filterTruthy, isNil } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { TagKind } from '../../../../../internal/declarations/types/tag-kind.type';
import { TagActionButtonTemplateDirective } from '../../directives/tag-action-button-template.directive';
import { TagStateService } from '../../services/tag-state.service';

@Component({
  selector: 'pupa-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  providers: [TagStateService],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent implements OnChanges {
  @ContentChild(TagActionButtonTemplateDirective)
  public readonly tagActionButtonTemplateDirective: TagActionButtonTemplateDirective;

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

  constructor(public readonly tagStateService: TagStateService) {}

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
