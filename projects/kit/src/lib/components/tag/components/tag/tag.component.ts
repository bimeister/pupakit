import { ChangeDetectionStrategy, Component, ContentChild, ViewEncapsulation } from '@angular/core';
import { filterTruthy } from '@bimeister/utilities';
import { TagBase } from '../../../../../internal/declarations/classes/abstract/tag-base.abstract';
import { take } from 'rxjs/operators';
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
export class TagComponent extends TagBase {
  @ContentChild(TagActionButtonTemplateDirective)
  public readonly tagActionButtonTemplateDirective: TagActionButtonTemplateDirective;

  constructor(tagStateService: TagStateService) {
    super(tagStateService);
  }

  public processInteraction(event: Event): void {
    this.isDisabled$.pipe(take(1), filterTruthy()).subscribe(() => {
      event.stopPropagation();
    });
  }
}
