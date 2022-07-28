import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, OnChanges, HostListener } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { TagKind } from '../../../../../internal/declarations/types/tag-kind.type';
import { TagStateService } from '../../services/tag-state.service';

@Component({
  selector: 'pupa-tag-action-button',
  templateUrl: './tag-action-button.component.html',
  styleUrls: ['./tag-action-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagActionButtonComponent implements OnChanges {
  @Input() public readonly active: boolean = false;
  public isActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly isDisabled$: Observable<boolean> = this.tagStateService.isDisabled$;
  public readonly kindClass$: Observable<string> = this.tagStateService.kind$.pipe(
    map((kind: TagKind) => `button_${kind}`)
  );

  constructor(private readonly tagStateService: TagStateService) {}

  @HostListener('touchstart', ['$event'])
  @HostListener('click', ['$event'])
  public processInteraction(event: Event): void {
    this.isDisabled$.pipe(take(1)).subscribe((isDisabled: boolean) => {
      if (isDisabled) {
        event.stopImmediatePropagation();
        return;
      }
      event.stopPropagation();
    });
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processActiveChange(changes?.active);
  }

  private processActiveChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isActive$.next(updatedValue);
  }
}
