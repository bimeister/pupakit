import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, HostListener, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { isNil, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ButtonComponent } from '../button/button.component';
import { DropdownMenuContentComponent } from '../../../dropdown-menu/components/dropdown-menu-content/dropdown-menu-content.component';
import { DropdownService } from '../../../dropdown-menu/services/dropdown.service';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';

@Component({
  selector: 'pupa-button-multi',
  templateUrl: './button-multi.component.html',
  styleUrls: ['./button-multi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [DropdownService]
})
export class ButtonMultiComponent extends ButtonComponent {
  @Input('dropdownMenuContent') public readonly dropdownMenuContent: DropdownMenuContentComponent;
  @ViewChild('overlayOrigin', { static: true }) protected readonly overlayOrigin: CdkOverlayOrigin;
  @Input() public readonly expandActive: boolean = false;
  public readonly expandActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isOpened$: Observable<boolean> = this.dropdownService.isOpened$;
  public readonly expandIcon$: Observable<string> = this.isOpened$.pipe(
    map((isOpened: boolean) => (isOpened ? 'ios-arrow-up' : 'ios-arrow-down')),
    shareReplayWithRefCount()
  );
  public readonly resultClassList$: Observable<string[]> = combineLatest([
    this.size$,
    this.kind$,
    this.disabled$.pipe(map((isDisabled: boolean) => (isDisabled ? 'disabled' : null))),
    this.active$.pipe(map((isActive: boolean) => (isActive ? 'active' : null))),
    this.expandActive$.pipe(map((isActive: boolean) => (isActive ? 'expand-active' : null))),
    this.iconContainerClass$
  ]).pipe(
    map((classes: string[]) =>
      classes
        .filter((innerClass: string) => !isNil(innerClass))
        .map((innerProperty: string) => `button-multi_${innerProperty}`)
    )
  );

  public readonly mainClassList$: Observable<string[]> = this.active$.pipe(
    map((isActive: boolean) => (isActive ? ['main_active'] : []))
  );

  public readonly expandClassList$: Observable<string[]> = this.expandActive$.pipe(
    map((isActive: boolean) => (isActive ? ['expand_active'] : []))
  );

  constructor(private readonly dropdownService: DropdownService) {
    super();
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    super.ngOnChanges(changes);
    this.processExpandActiveChange(changes?.expandActive);
  }

  public ngOnInit(): void {
    this.registerDropdownTrigger();
  }

  @HostListener('click')
  @HostListener('touchstart')
  public setOpened(isOpened: boolean): void {
    this.dropdownService.setOpened(isOpened);
  }

  private processExpandActiveChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.expandActive$.next(updatedValue);
  }

  private registerDropdownTrigger(): void {
    this.dropdownService.registerTooltipOverlayOrigin(this.overlayOrigin);
  }
}
