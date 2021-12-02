import { HorizontalConnectionPos, Overlay } from '@angular/cdk/overlay';
import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  TemplateRef,
} from '@angular/core';
import { filterNotNil, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { pluck, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { ComponentChange } from '../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../internal/declarations/interfaces/component-changes.interface';
import { Uuid } from '../../../../internal/declarations/types/uuid.type';
import { DropdownMenuContentComponent } from '../components/dropdown-menu-content/dropdown-menu-content.component';
import { DropdownMenu } from '../declarations/classes/dropdown-menu.class';
import { DropdownMenuService } from '../services/dropdown-menu.service';

type ContentComponent = Nullable<DropdownMenuContentComponent>;
const CURSOR_POINTER: string = 'pointer';
const CURSOR_NOT_ALLOWED: string = 'not-allowed';

@Directive({
  selector: '[pupaDropdownMenu]',
  exportAs: 'pupaDropdownMenu',
})
export class DropdownMenuDirective implements OnChanges, OnDestroy {
  @HostBinding('style.cursor') public cursorStyle: string = CURSOR_POINTER;

  @Input() public pupaDropdownMenu: ContentComponent;
  private readonly dropdownMenuContentComponent$: BehaviorSubject<ContentComponent> =
    new BehaviorSubject<ContentComponent>(null);

  private readonly contextId$: Observable<Uuid> = this.dropdownMenuContentComponent$.pipe(
    filterNotNil(),
    pluck('contextId')
  );

  @Input() public dropdownMenuDisabled: boolean = false;

  public readonly isOpen$: Observable<boolean> = this.contextId$.pipe(
    switchMap((id: Uuid) => this.dropdownMenuService.getDropdownIsOpen(id))
  );

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly dropdownMenuService: DropdownMenuService,
    public readonly triggerRef: ElementRef<HTMLElement>,
    private readonly overlay: Overlay
  ) {
    this.registerDropdown();
    this.subscription.add(this.setContentTemplateWhenContentComponentChanged());
    this.subscription.add(this.setContentHorizontalPositionWhenContentComponentChanged());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processIsDisabledChange(changes?.dropdownMenuDisabled);
    this.processPupaDropdownMenuChange(changes?.pupaDropdownMenu);
  }

  public ngOnDestroy(): void {
    this.contextId$.pipe(take(1)).subscribe((id: Uuid) => {
      this.dropdownMenuService.setDropdownIsOpen(id, false);
      this.dropdownMenuService.unregisterDropdown(id);
    });

    this.subscription.unsubscribe();
  }

  @HostListener('document:wheel')
  @HostListener('document:mousedown')
  @HostListener('document:touchmove')
  public close(): void {
    if (this.dropdownMenuDisabled) {
      return;
    }

    this.setIsOpen(false);
  }

  @HostListener('click')
  public handleClick(): void {
    if (this.dropdownMenuDisabled) {
      return;
    }

    this.toggleDropdownMenu();
  }

  public setIsOpen(isOpen: boolean): void {
    this.contextId$.pipe(take(1)).subscribe((id: Uuid) => {
      this.dropdownMenuService.setDropdownIsOpen(id, isOpen);
    });
  }

  private toggleDropdownMenu(): void {
    this.isOpen$.pipe(take(1)).subscribe((isOpen: boolean) => this.setIsOpen(!isOpen));
  }

  private setContentTemplateWhenContentComponentChanged(): Subscription {
    return this.dropdownMenuContentComponent$
      .pipe(
        filterNotNil(),
        switchMap((contentComponent: ContentComponent) => contentComponent.contentTemplate$),
        filterNotNil(),
        withLatestFrom(this.contextId$)
      )
      .subscribe(([contentTemplate, id]: [Nullable<TemplateRef<unknown>>, Uuid]) => {
        this.dropdownMenuService.setDropdownTemplate(id, contentTemplate);
      });
  }

  private setContentHorizontalPositionWhenContentComponentChanged(): Subscription {
    return this.dropdownMenuContentComponent$
      .pipe(
        filterNotNil(),
        switchMap((contentComponent: ContentComponent) => contentComponent.horizontalPosition$),
        filterNotNil(),
        withLatestFrom(this.contextId$)
      )
      .subscribe(([horizontalPosition, id]: [HorizontalConnectionPos, Uuid]) => {
        this.dropdownMenuService.setDropdownHorizontalPosition(id, horizontalPosition);
      });
  }

  private registerDropdown(): void {
    this.contextId$.pipe(take(1)).subscribe((id: Uuid) => {
      this.dropdownMenuService.registerDropdown(id, new DropdownMenu(this.overlay, id));
      this.setTriggerRef();
    });
  }

  private setTriggerRef(): void {
    this.contextId$.pipe(take(1)).subscribe((id: Uuid) => {
      this.dropdownMenuService.setDropdownTriggerRef(id, this.triggerRef);
    });
  }

  private processPupaDropdownMenuChange(change: ComponentChange<this, ContentComponent>): void {
    const newValue: ContentComponent | undefined = change?.currentValue;

    if (isNil(newValue)) {
      return;
    }

    this.dropdownMenuContentComponent$.next(newValue);
  }

  private processIsDisabledChange(change: ComponentChange<this, boolean>): void {
    const newValue: boolean | undefined = change?.currentValue;

    if (isNil(newValue) || !newValue) {
      this.cursorStyle = CURSOR_POINTER;
      return;
    }

    this.cursorStyle = CURSOR_NOT_ALLOWED;
  }
}
