import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TagSize } from '../../../../../internal/declarations/types/color-size.type';
import { TagColor } from '../../../../../internal/declarations/types/color-tag.types';
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

  @Input() public set color(value: TagColor) {
    if (isNil(value)) {
      return;
    }

    this.$color.next(value);
  }
  private readonly $color: BehaviorSubject<TagColor> = new BehaviorSubject<TagColor>('default');

  public readonly colorClass$: Observable<string> = this.$color.pipe(map((color: TagColor) => `tag_${color}`));

  @Input() public set size(value: TagSize) {
    if (isNil(value)) {
      return;
    }

    this.$size.next(value);
  }
  private readonly $size: BehaviorSubject<TagSize> = new BehaviorSubject<TagSize>('medium');

  public readonly sizeClass$: Observable<string> = this.$size.pipe(map((size: TagSize) => `tag_${size}`));

  @Input() public disabled: boolean = false;

  @Input() public clickable: boolean = false;

  @Input() public tabIndex: number = 0;

  get tabIndexAttribute(): null | number {
    if (this.clickable) {
      return this.tabIndex;
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
