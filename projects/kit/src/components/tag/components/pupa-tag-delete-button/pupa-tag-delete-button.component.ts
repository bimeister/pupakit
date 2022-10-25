import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { filterTruthy } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { TagStateService } from '../../services/tag-state.service';

@Component({
  selector: 'pupa-tag-delete-button',
  templateUrl: './pupa-tag-delete-button.component.html',
  styleUrls: ['./pupa-tag-delete-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagDeleteButtonComponent {
  public readonly isDisabled$: Observable<boolean> = this.tagStateService.isDisabled$;

  constructor(private readonly tagStateService: TagStateService) {}

  public closeHandler(event: Event): void {
    this.isDisabled$.pipe(take(1), filterTruthy()).subscribe(() => {
      event.stopPropagation();
    });
  }
}
