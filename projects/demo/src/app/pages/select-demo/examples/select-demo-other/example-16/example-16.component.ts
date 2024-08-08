import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { getUuid, isEmpty } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import { map, startWith, switchMap, take } from 'rxjs/operators';
import { ClientUiStateHandlerService } from '@bimeister/pupakit.common';

interface User {
  id: string;
  name: string;
  surname: string;
  login: string;
  username: string;
}

const DEFAULT_USERS_COUNT: number = 100;
const ITEM_SIZE_REM: number = 10;

const GROUP_1_USERS: User[] = Array(DEFAULT_USERS_COUNT)
  .fill(null)
  .map((_: null, index: number) => ({
    id: getUuid(),
    name: `Name${index + 1}`,
    surname: `Surname${index + 1}`,
    login: `login${index + 1}@login.com`,
    username: `Name${index + 1} Surname${index + 1}`,
  }));

const GROUP_2_USERS: User[] = Array(DEFAULT_USERS_COUNT)
  .fill(null)
  .map((_: null, index: number) => ({
    id: getUuid(),
    name: `Name${DEFAULT_USERS_COUNT + index + 1}`,
    surname: `Surname${DEFAULT_USERS_COUNT + index + 1}`,
    login: `login${DEFAULT_USERS_COUNT + index + 1}@login.com`,
    username: `Name${DEFAULT_USERS_COUNT + index + 1} Surname${DEFAULT_USERS_COUNT + index + 1}`,
  }));

const USERS_MAP: Map<string, User> = new Map([...GROUP_1_USERS, ...GROUP_2_USERS].map((user: User) => [user.id, user]));

@Component({
  selector: 'demo-select-example-16',
  templateUrl: './example-16.component.html',
  styleUrls: ['./example-16.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectExample16Component implements OnDestroy {
  public readonly control: FormControl = new FormControl([]);
  public readonly searchControl: FormControl = new FormControl();
  public readonly selectedControl: FormControl = new FormControl(false);

  private readonly controlValue$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private readonly searchControlValue$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private readonly selectedControlValue$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly itemSizePx$: Observable<number> = this.clientUiStateHandlerService.remSizePx$.pipe(
    map((remSizePx: number) => remSizePx * ITEM_SIZE_REM)
  );

  public readonly usersByGroup1$: Observable<User[]> = combineLatest([
    this.searchControlValue$,
    this.selectedControlValue$,
  ]).pipe(
    switchMap(([searchControlValue, selectedControlValue]: [string, boolean]) =>
      this.getFilteredUsers(searchControlValue, selectedControlValue, GROUP_1_USERS)
    )
  );

  public readonly usersByGroup2$: Observable<User[]> = combineLatest([
    this.searchControlValue$,
    this.selectedControlValue$,
  ]).pipe(
    switchMap(([searchControlValue, selectedControlValue]: [string, boolean]) =>
      this.getFilteredUsers(searchControlValue, selectedControlValue, GROUP_2_USERS)
    )
  );

  public readonly selectedUsers$: Observable<User[]> = this.controlValue$.pipe(
    map((userIds: string[]) => userIds.map((userId: string) => USERS_MAP.get(userId)))
  );

  public readonly usersByGroup1IsEmpty$: Observable<boolean> = this.usersByGroup1$.pipe(
    map((users: User[]) => isEmpty(users))
  );
  public readonly usersByGroup2IsEmpty$: Observable<boolean> = this.usersByGroup2$.pipe(
    map((users: User[]) => isEmpty(users))
  );

  private readonly subscription: Subscription = new Subscription();
  constructor(private readonly clientUiStateHandlerService: ClientUiStateHandlerService) {
    this.subscription.add(this.setInitialSubjectData());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public handleUserDelete(user: User, event: Event): void {
    event.stopPropagation();
    this.controlValue$
      .pipe(
        take(1),
        map((userIds: string[]) => userIds.filter((userId: string) => userId !== user.id))
      )
      .subscribe((updatedUserIds: string[]) => this.control.setValue(updatedUserIds));
  }

  private getFilteredUsers(
    searchControlValue: string,
    selectedControlValue: boolean,
    usersData: User[]
  ): Observable<User[]> {
    const serializedSearchValue: string = searchControlValue?.trim().toLocaleLowerCase();

    const filteredUsersBySearchList: User[] = isEmpty(serializedSearchValue)
      ? usersData
      : usersData.filter((user: User) =>
          `${user.username} ${user.login}`.toLowerCase().includes(searchControlValue.toLowerCase())
        );

    if (!selectedControlValue) {
      return of(filteredUsersBySearchList);
    }

    return this.controlValue$.pipe(
      map((selectedUserIds: string[]) => {
        const selectedUserIdSet: Set<string> = new Set(selectedUserIds);
        return filteredUsersBySearchList.filter((user: User) => selectedUserIdSet.has(user.id));
      })
    );
  }

  private setInitialSubjectData(): Subscription {
    return combineLatest([
      this.control.valueChanges.pipe(startWith(this.control.value)),
      this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
      this.selectedControl.valueChanges.pipe(startWith(this.selectedControl.value)),
    ]).subscribe(([controlValue, searchControlValue, selectedControlValue]: [string[], string, boolean]) => {
      this.controlValue$.next(controlValue);
      this.searchControlValue$.next(searchControlValue);
      this.selectedControlValue$.next(selectedControlValue);
    });
  }
}
