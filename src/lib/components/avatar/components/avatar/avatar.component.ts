import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { getHslColorFromString, HslColor, isEmpty, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';

@Component({
  selector: 'pupa-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent implements OnChanges {
  @Input() public username: string;
  private readonly username$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);
  public readonly usernameFirstChar$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);

  @Input() public src: string;
  public readonly src$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);

  public readonly hslBackgroundColor$: Observable<string> = this.username$.pipe(
    map((username: Nullable<string>) => {
      const { h, s, l }: HslColor = getHslColorFromString(username);
      return `hsl(${h}, ${s}%, ${l}%)`;
    })
  );

  public readonly backgroundImage$: Observable<string> = this.src$.pipe(
    map((src: Nullable<string>) => {
      return `url('${src ?? ''}')`;
    })
  );

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processUsernameChange(changes?.username);
    this.processSrcChange(changes?.src);
  }

  private processUsernameChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (typeof updatedValue !== 'string') {
      return;
    }

    const firstChar: string = updatedValue.charAt(0).toUpperCase();
    this.username$.next(updatedValue);
    this.usernameFirstChar$.next(firstChar);
  }

  private processSrcChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    const serializedValue: string = isEmpty(updatedValue) ? null : updatedValue;
    this.src$.next(serializedValue);
  }
}
