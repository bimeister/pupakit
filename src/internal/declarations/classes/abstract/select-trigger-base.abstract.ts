import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { AfterViewInit, Directive, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { distinctUntilSerializedChanged, filterFalsy, isEmpty, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { SelectStateService } from '../../interfaces/select-state-service.interface';

const BUTTON_WIDTH_PX: number = 24;

@Directive()
export abstract class SelectTriggerBase<T> implements OnInit, AfterViewInit {
  protected abstract readonly overlayOrigin: CdkOverlayOrigin;
  protected abstract readonly button: ElementRef<HTMLButtonElement>;

  public readonly isExpanded$: BehaviorSubject<boolean> = this.selectStateService.isExpanded$;
  public readonly isDisabled$: Observable<boolean> = this.selectStateService.isDisabled$;

  public readonly isTouched$: Observable<boolean> = this.selectStateService.isTouched$;
  public readonly isPatched$: Observable<boolean> = this.selectStateService.isPatched$;
  public readonly isValid$: Observable<boolean> = this.selectStateService.isValid$;
  public readonly isFilled$: Observable<boolean> = this.selectStateService.isFilled$;
  public readonly withReset$: Observable<boolean> = this.selectStateService.withReset$;

  public readonly placeholder$: Observable<string> = this.selectStateService.placeholder$;
  public readonly placeholderIsVisibleOnHover$: Observable<boolean> =
    this.selectStateService.placeholderIsVisibleOnHover$;

  public readonly isInvalid$: Observable<boolean> = combineLatest([
    this.isDisabled$,
    this.isPatched$,
    this.isValid$,
    this.isTouched$,
  ]).pipe(
    distinctUntilSerializedChanged(),
    map(
      ([isDisabled, isPatched, isValid, isTouched]: [boolean, boolean, boolean, boolean]) =>
        (isTouched || isPatched) && !isValid && !isDisabled
    )
  );

  public readonly triggerValueIsVisible$: Observable<boolean> = combineLatest([this.isFilled$, this.placeholder$]).pipe(
    map(([isFilled, placeholder]: [boolean, Nullable<string>]) => isFilled || isNil(placeholder))
  );

  public readonly isVisibleReset$: Observable<boolean> = combineLatest([
    this.withReset$,
    this.isFilled$,
    this.isDisabled$
  ]).pipe(
    map(([withReset, isFilled, isDisabled]: [boolean, boolean, boolean]) => withReset && isFilled && !isDisabled)
  );

  public readonly invalidTooltipHideOnHover$: Observable<boolean> = this.selectStateService.invalidTooltipHideOnHover$;
  public readonly invalidTooltipDisabled$: Observable<boolean> = this.selectStateService.invalidTooltipDisabled$;
  public readonly invalidTooltip$: Observable<Nullable<string>> = this.selectStateService.invalidTooltip$;
  public readonly invalidTooltipContentTemplate$: Observable<Nullable<TemplateRef<unknown>>> =
    this.selectStateService.invalidTooltipContentTemplate$;

  public readonly isInvalidTooltipDisabled$: Observable<boolean> = combineLatest([
    this.invalidTooltip$,
    this.invalidTooltipContentTemplate$,
    this.invalidTooltipDisabled$
  ]).pipe(
    map(
      ([invalidTooltip, invalidTooltipContentTemplate, invalidTooltipDisabled]: [
        Nullable<string>,
        Nullable<TemplateRef<unknown>>,
        boolean
      ]) => (isEmpty(invalidTooltip) && isNil(invalidTooltipContentTemplate) ? true : invalidTooltipDisabled)
    )
  );

  public readonly rightPaddingPx$: Observable<number> = combineLatest([this.isInvalid$, this.isVisibleReset$]).pipe(
    map((states: boolean[]) =>
      states.reduce((width: number, state: boolean) => (state ? width + BUTTON_WIDTH_PX : width), 0)
    )
  );

  public readonly isContentInit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(protected readonly selectStateService: SelectStateService<T>) {}

  public ngOnInit(): void {
    this.defineDropdownTrigger();
  }

  public ngAfterViewInit(): void {
    this.isContentInit$.next(true);
  }

  public processButtonClick(): void {
    this.isDisabled$.pipe(take(1), filterFalsy()).subscribe(() => this.selectStateService.toggleExpansion());
  }

  public toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDisabled$.pipe(take(1), filterFalsy()).subscribe(() => this.selectStateService.toggleExpansion());
  }

  public reset(): void {
    this.selectStateService.reset();
  }

  public processButtonInputClick(): void {
    this.isDisabled$
      .pipe(
        take(1),
        filterFalsy(),
        switchMap(() => this.isExpanded$),
        take(1),
        filterFalsy()
      )
      .subscribe(() => this.selectStateService.open());
  }

  private defineDropdownTrigger(): void {
    this.selectStateService.defineDropdownTrigger(this.overlayOrigin, this.button.nativeElement);
  }
}
