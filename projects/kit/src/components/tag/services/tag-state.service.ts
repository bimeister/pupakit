import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TagStateServiceDeclaration } from '../../../declarations/interfaces/tag-state-service.interface';
import { TagKind } from '../../../declarations/types/tag-kind.type';

@Injectable()
export class TagStateService implements TagStateServiceDeclaration {
  public readonly isDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly tabIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly isClickable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly kind$: BehaviorSubject<TagKind> = new BehaviorSubject<TagKind>('opacity');
}
