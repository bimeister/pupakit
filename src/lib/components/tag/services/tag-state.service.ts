import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TagSize } from '../../../../internal/declarations/types/color-size.type';
import { TagColor } from '../../../../internal/declarations/types/color-tag.types';

@Injectable()
export class TagStateService {
  public readonly isDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly size$: BehaviorSubject<TagSize> = new BehaviorSubject<TagSize>('medium');
  public readonly tabIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly isClickable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly color$: BehaviorSubject<TagColor> = new BehaviorSubject<TagColor>('default');
}
