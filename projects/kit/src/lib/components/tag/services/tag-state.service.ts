import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TagKind } from '../../../../internal/declarations/types/tag-kind.type';

@Injectable()
export class TagStateService {
  public readonly isDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly tabIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly isClickable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly kind$: BehaviorSubject<TagKind> = new BehaviorSubject<TagKind>('opacity');
}
