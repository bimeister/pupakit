import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { isEmpty, Nullable } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { SelectTriggerTagContext } from '../../../../../internal/declarations/interfaces/select-trigger-tag-context.interface';
import { PupaSelectTriggerTagTemplate } from '../../directives/select-trigger-tag-template.directive';
import { SelectStateService } from '../../services/select-state.service';
import { SelectButtonBase } from './../../../../../internal/declarations/classes/abstract/select-button-base.abstract';

const MAX_TAGS_RENDER_COUNT: number = 20;

@Component({
  selector: 'pupa-select-trigger-tags',
  templateUrl: './select-trigger-tags.component.html',
  styleUrls: ['./select-trigger-tags.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectTriggerTagsComponent<T> extends SelectButtonBase<T> implements OnChanges {
  @ViewChild('overlayOrigin', { static: true }) protected readonly overlayOrigin: CdkOverlayOrigin;
  @ViewChild('button', { static: true }) protected readonly button: ElementRef<HTMLButtonElement>;

  @Input() public tags: T[] = [];
  public readonly renderTags$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  private readonly tagsTotalCount$: BehaviorSubject<Nullable<number>> = new BehaviorSubject<Nullable<number>>(null);

  @ContentChild(PupaSelectTriggerTagTemplate) public readonly selectTriggerTagTemplate: PupaSelectTriggerTagTemplate<T>;

  @ViewChild('defaultTemplate') private readonly defaultTemplateRef: TemplateRef<SelectTriggerTagContext<T>>;

  constructor(selectStateService: SelectStateService<T>) {
    super(selectStateService);
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processCodeFilePathChange(changes?.tags);
  }

  public getSelectTriggerTagTemplateRef(): TemplateRef<SelectTriggerTagContext<T>> {
    return this.selectTriggerTagTemplate?.templateRef ?? this.defaultTemplateRef;
  }

  private processCodeFilePathChange(change: ComponentChange<this, T[]>): void {
    const updatedValue: T[] | undefined = change?.currentValue;

    if (isEmpty(updatedValue)) {
      return;
    }

    const serializedTags: T[] = updatedValue.slice(0, MAX_TAGS_RENDER_COUNT);
    this.renderTags$.next(serializedTags);

    this.tagsTotalCount$.next(updatedValue.length);
  }
}
