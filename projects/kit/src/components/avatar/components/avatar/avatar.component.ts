import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { getHslColorFromString, HslColor, isEmpty, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getInitials } from '../../../../declarations/functions/get-initials.function';
import { AvatarSize } from '../../../../declarations/types/avatar-size.type';

const SATURATION: number = 75;
const LIGHTNESS: number = 80;

enum Mode {
  Icon = 'icon',
  Image = 'image',
  Username = 'username',
  Default = 'default',
}

@Component({
  selector: 'pupa-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent implements OnChanges {
  @Input() public username: string | null = null;
  public readonly username$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);

  @Input() public iconName: string | null = null;
  public readonly iconName$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);

  @Input() public src: string | null = null;
  public readonly src$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);

  @Input() public size: AvatarSize = 'small';
  public readonly size$: BehaviorSubject<AvatarSize> = new BehaviorSubject<AvatarSize>('small');

  @Input() public disabled: boolean = false;
  public readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public backgroundSeed: Nullable<string> = null;
  public readonly backgroundSeed$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);

  public readonly sizeClass$: Observable<string> = this.size$.pipe(map((size: string) => `avatar_${size}`));

  public readonly isEmptyBackgroundSeed$: Observable<boolean> = this.backgroundSeed$.pipe(map(isEmpty));

  public readonly hslBackgroundColor$: Observable<string> = combineLatest([this.backgroundSeed$, this.disabled$]).pipe(
    map(([backgroundSeed, isDisabled]: [Nullable<string>, boolean]) => {
      if (isNil(backgroundSeed) || isDisabled) {
        return null;
      }
      const { h, s, l }: HslColor = getHslColorFromString(backgroundSeed, SATURATION, LIGHTNESS);
      return `hsl(${h}, ${s}%, ${l}%)`;
    })
  );
  public readonly initials$: Observable<Nullable<string>> = this.username$.pipe(
    map((username: Nullable<string>) => getInitials(username))
  );

  public readonly backgroundImage$: Observable<string> = this.src$.pipe(
    map((src: Nullable<string>) => `url('${src ?? ''}')`)
  );

  public readonly mode$: Observable<Mode> = combineLatest([this.iconName$, this.src$, this.username$]).pipe(
    map(([iconName, src, username]: [Nullable<string>, Nullable<string>, Nullable<string>]) => {
      if (!isNil(iconName)) {
        return Mode.Icon;
      }
      if (!isNil(src)) {
        return Mode.Image;
      }
      if (!isNil(username)) {
        return Mode.Username;
      }

      return Mode.Default;
    })
  );
  public readonly mode: typeof Mode = Mode;

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processUsernameChange(changes.username);
    this.processIconNameChange(changes.iconName);
    this.processSrcChange(changes.src);
    this.processSizeChange(changes.size);
    this.processDisabledChange(changes.disabled);

    if (changes.hasOwnProperty('backgroundSeed')) {
      this.processBackgroundSeedChange(changes.backgroundSeed);
    }
  }

  private processUsernameChange(change: ComponentChange<this, string | null> | undefined): void {
    const updatedValue: Nullable<string> = change?.currentValue;

    if (typeof updatedValue !== 'string') {
      return;
    }
    if (isEmpty(updatedValue.trim())) {
      return this.username$.next(null);
    }
    this.username$.next(updatedValue);
  }
  private processIconNameChange(change: ComponentChange<this, string | null> | undefined): void {
    const updatedValue: Nullable<string> = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    const serializedValue: string = isEmpty(updatedValue) ? null : updatedValue;
    this.iconName$.next(serializedValue);
  }

  private processSrcChange(change: ComponentChange<this, string | null> | undefined): void {
    const updatedValue: Nullable<string> = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    const serializedValue: string = isEmpty(updatedValue) ? null : updatedValue;
    this.src$.next(serializedValue);
  }

  private processSizeChange(change: ComponentChange<this, AvatarSize> | undefined): void {
    const updatedValue: AvatarSize | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.size$.next(updatedValue);
  }

  private processDisabledChange(change: ComponentChange<this, boolean> | undefined): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.disabled$.next(updatedValue);
  }

  private processBackgroundSeedChange(change: ComponentChange<this, string>): void {
    this.backgroundSeed$.next(isEmpty(change.currentValue?.trim()) ? null : change.currentValue);
  }
}
