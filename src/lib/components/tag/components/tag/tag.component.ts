import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  ContentChild,
  AfterContentInit
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isNil } from '@bimeister/utilities';

import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { AvatarComponent } from '../../../avatar/components/avatar/avatar.component';

@Component({
  selector: 'pupa-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent implements OnChanges, AfterContentInit {
  @ContentChild(AvatarComponent) private readonly avatarComponent: AvatarComponent;

  @Input() public disabled: boolean = false;
  public readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public clickable: boolean = false;
  public readonly clickable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly withAvatar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processDisabledChange(changes?.disabled);
    this.processClickableChange(changes?.clickable);
  }

  public ngAfterContentInit(): void {
    this.processWithAvatar();
  }

  private processWithAvatar(): void {
    if (this.avatarComponent !== undefined) {
      this.withAvatar$.next(true);
    }
  }

  private processDisabledChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.disabled$.next(updatedValue);
  }

  private processClickableChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.clickable$.next(updatedValue);
  }
}
