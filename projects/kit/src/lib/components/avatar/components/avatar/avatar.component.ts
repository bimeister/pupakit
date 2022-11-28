import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { getHslColorFromString, HslColor, isEmpty, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { AvatarSize } from '../../../../../internal/declarations/types/avatar-size.type';
import { getInitials } from '../../../../../internal/functions/get-initials.function';

const SATURATION: number = 88;
const LIGHTNESS: number = 78;

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
  @Input() public username: string;
  public readonly username$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);

  @Input() public iconName: string;
  public readonly iconName$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);

  @Input() public src: string;
  public readonly src$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);

  @Input() public size: AvatarSize = 'small';
  public readonly size$: BehaviorSubject<AvatarSize> = new BehaviorSubject<AvatarSize>('small');

  @Input() public withBorder: boolean = false;
  public readonly withBorder$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public disabled: boolean = false;
  public readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly resultClassList$: Observable<string[]> = combineLatest([
    this.size$,
    this.withBorder$.pipe(map((withBorder: boolean) => (Boolean(withBorder) ? 'bordered' : null))),
  ]).pipe(
    map((classes: string[]) =>
      classes
        .filter((innerClass: string) => !isNil(innerClass))
        .map((innerProperty: string) => `avatar_${innerProperty}`)
    )
  );

  public readonly isEmptyUserName$: Observable<boolean> = this.username$.pipe(map(isEmpty));

  public readonly hslBackgroundColor$: Observable<string> = combineLatest([this.username$, this.disabled$]).pipe(
    map(([username, isDisabled]: [Nullable<string>, boolean]) => {
      if (isEmpty(username) || isDisabled) {
        return null;
      }
      const { h, s, l }: HslColor = getHslColorFromString(username, SATURATION, LIGHTNESS);
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
    this.processUsernameChange(changes?.username);
    this.processIconNameChange(changes?.iconName);
    this.processSrcChange(changes?.src);
    this.processSizeChange(changes?.size);
    this.processWithBorderChange(changes?.withBorder);
    this.processDisabledChange(changes?.disabled);
  }

  private processUsernameChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (typeof updatedValue !== 'string') {
      return;
    }
    if (isEmpty(updatedValue.trim())) {
      return this.username$.next(null);
    }
    this.username$.next(updatedValue);
  }
  private processIconNameChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    const serializedValue: string = isEmpty(updatedValue) ? null : updatedValue;
    this.iconName$.next(serializedValue);
  }

  private processSrcChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    const serializedValue: string = isEmpty(updatedValue) ? null : updatedValue;
    this.src$.next(serializedValue);
  }

  private processSizeChange(change: ComponentChange<this, AvatarSize>): void {
    const updatedValue: AvatarSize | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.size$.next(updatedValue);
  }

  private processWithBorderChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.withBorder$.next(updatedValue);
  }

  private processDisabledChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.disabled$.next(updatedValue);
  }
}
