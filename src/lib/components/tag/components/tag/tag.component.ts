import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  ContentChild,
  AfterContentInit
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AvatarComponent } from '../../../avatar/components/avatar/avatar.component';

@Component({
  selector: 'pupa-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent implements AfterContentInit {
  @ContentChild(AvatarComponent) private readonly avatarComponent: AvatarComponent;

  @Input() public disabled: boolean = false;

  @Input() public clickable: boolean = false;

  @Input() public tabindex: number = 0;

  get tabindexAttribute(): null | number {
    if (this.clickable) {
      return this.tabindex;
    } else {
      return null;
    }
  }

  public readonly withAvatar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public ngAfterContentInit(): void {
    this.processWithAvatarChange();
  }

  private processWithAvatarChange(): void {
    const withAvatar: boolean = this.avatarComponent !== undefined;
    this.withAvatar$.next(withAvatar);
  }
}
