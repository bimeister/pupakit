import { BehaviorSubject } from 'rxjs';
import { TagKind } from '../types/tag-kind.type';

export interface TagStateServiceDeclaration {
  readonly isDisabled$: BehaviorSubject<boolean>;
  readonly tabIndex$: BehaviorSubject<number>;
  readonly isClickable$: BehaviorSubject<boolean>;
  readonly kind$: BehaviorSubject<TagKind>;
}
