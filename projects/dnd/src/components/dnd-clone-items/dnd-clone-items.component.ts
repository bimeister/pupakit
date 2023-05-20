import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  Input,
  ContentChild,
  TemplateRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import { DndCloneItemTemplateDirective } from '../../directives/dnd-clone-item-template.directive';
import { DndCloneGroupItemsTemplateDirective } from '../../directives/dnd-clone-group-items-template.directive';
import { DndItem } from '../../declarations/interfaces/dnd-item.interface';

const MAX_DISPLAYED_ITEMS_COUNT: number = 3;

@Component({
  selector: 'pupa-dnd-clone-items',
  templateUrl: './dnd-clone-items.component.html',
  styleUrls: ['./dnd-clone-items.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DndCloneItemsComponent<T> implements OnInit {
  @ContentChild(DndCloneItemTemplateDirective, { static: true })
  public dndCloneItemTemplate: DndCloneItemTemplateDirective | undefined;

  @ContentChild(DndCloneGroupItemsTemplateDirective, { static: true })
  public dndCloneGroupItemsTemplate: DndCloneGroupItemsTemplateDirective | undefined;

  @ViewChild('defaultCloneGroupItemsTemplate', { static: true })
  public defaultCloneGroupItemsTemplate: TemplateRef<unknown> | undefined;

  public templatesGroupItemsTemplate: TemplateRef<unknown> | undefined;

  @Input() public dndSourceItems: DndItem<T>[] = [];

  public readonly maxDisplayedItemsCount: number = MAX_DISPLAYED_ITEMS_COUNT;

  public ngOnInit(): void {
    this.templatesGroupItemsTemplate =
      this.dndCloneGroupItemsTemplate?.templateRef ?? this.defaultCloneGroupItemsTemplate;
  }
}
