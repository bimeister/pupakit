import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  OnChanges,
  ViewEncapsulation,
} from '@angular/core';
import { isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { TagSize } from '../../../../../internal/declarations/types/color-size.type';
import { TagColor } from '../../../../../internal/declarations/types/color-tag.types';
import { AvatarComponent } from '../../../avatar/components/avatar/avatar.component';
import { TagStateService } from '../../services/tag-state.service';

@Component({
  selector: 'pupa-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  providers: [TagStateService],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent implements AfterContentInit, OnChanges {
  @ContentChild(AvatarComponent) private readonly avatarComponent: AvatarComponent;

  @Input() public disabled: boolean = false;
  public readonly isDisabled$: BehaviorSubject<boolean> = this.tagStateService.isDisabled$;

  @Input() public clickable: boolean = false;
  public readonly isClickable$: BehaviorSubject<boolean> = this.tagStateService.isClickable$;

  @Input() public bold: boolean = true;
  public readonly isBold$: BehaviorSubject<boolean> = this.tagStateService.isBold$;

  @Input() public withBorder: boolean = false;
  public readonly isWithBorder$: BehaviorSubject<boolean> = this.tagStateService.isWithBorder$;

  @Input() public tabIndex: number = 0;
  public readonly tabIndex$: BehaviorSubject<number> = this.tagStateService.tabIndex$;

  @Input() public color: TagColor = 'default';
  private readonly color$: BehaviorSubject<TagColor> = this.tagStateService.color$;

  @Input() public size: TagSize = 'medium';
  private readonly size$: BehaviorSubject<TagSize> = this.tagStateService.size$;

  public readonly colorClass$: Observable<string> = this.color$.pipe(map((color: TagColor) => `tag_${color}`));
  public readonly sizeClass$: Observable<string> = this.size$.pipe(map((size: TagSize) => `tag_${size}`));

  public get tabIndexAttribute(): Nullable<number> {
    return this.clickable ? this.tabIndex : null;
  }

  public readonly withAvatar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private readonly tagStateService: TagStateService) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processDisabledChange(changes?.disabled);
    this.processClickableChange(changes?.clickable);
    this.processTabIndexChange(changes?.tabIndex);
    this.processColorChange(changes?.color);
    this.processSizeChange(changes?.size);
    this.processBoldChange(changes?.bold);
    this.processWithBorderChange(changes?.withBorder);
  }

  public ngAfterContentInit(): void {
    this.processWithAvatarChange();
  }

  private processWithAvatarChange(): void {
    const withAvatar: boolean = this.avatarComponent !== undefined;
    this.withAvatar$.next(withAvatar);
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

  private processTabIndexChange(change: ComponentChange<this, number>): void {
    const updatedValue: number | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.tabIndex$.next(updatedValue);
  }

  private processColorChange(change: ComponentChange<this, TagColor>): void {
    const updatedValue: TagColor | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.color$.next(updatedValue);
  }

  private processSizeChange(change: ComponentChange<this, TagSize>): void {
    const updatedValue: TagSize | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.size$.next(updatedValue);
  }

  private processBoldChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isBold$.next(updatedValue);
  }

  private processWithBorderChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isWithBorder$.next(updatedValue);
  }
}
