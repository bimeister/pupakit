import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { isEmpty, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, pairwise, take, withLatestFrom } from 'rxjs/operators';
import { AnchorService } from '../../../../../common/services/anchor.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'h1[demoAnchor], h2[demoAnchor], h3[demoAnchor], h4[demoAnchor], h5[demoAnchor], h6[demoAnchor]',
  templateUrl: 'anchor.component.html',
  styleUrls: ['anchor.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnchorComponent implements OnChanges, OnInit, OnDestroy {
  @Input() public readonly anchorName: string;
  public readonly anchorName$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);

  public readonly anchorIsActivated$: Observable<boolean> = this.anchorService.animateActiveAnchorEvent$.pipe(
    withLatestFrom(this.anchorService.anchorNameFromUrl$, this.anchorName$),
    map(
      ([, activatedAnchorName, anchorName]: [void, Nullable<string>, Nullable<string>]) =>
        !isNil(activatedAnchorName) && !isNil(anchorName) && activatedAnchorName === anchorName
    )
  );

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly anchorService: AnchorService, private readonly elementRef: ElementRef<HTMLElement>) {
    this.subscription.add(this.anchorNameHandler());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processAnchorNameChange(changes?.anchorName);
  }

  public ngOnInit(): void {
    this.parseAnchorNameIfNoInputValue();
  }

  public ngOnDestroy(): void {
    this.destroyAnchor();
  }

  public copyHrefAndShowToast(): void {
    this.anchorName$
      .pipe(take(1))
      .subscribe((anchorName: Nullable<string>) => this.anchorService.copyHrefAndShowToast(anchorName));
  }

  private anchorNameHandler(): Subscription {
    return this.anchorName$
      .pipe(pairwise())
      .subscribe(([previousAnchorName, currentAnchorName]: [Nullable<string>, Nullable<string>]) => {
        if (!isEmpty(previousAnchorName)) {
          this.unregisterAnchor(previousAnchorName);
        }

        if (!isEmpty(currentAnchorName)) {
          this.registerAnchor(currentAnchorName);
        }
      });
  }

  private processAnchorNameChange(change: ComponentChange<this, string>): void {
    const updatedValue: Nullable<string> = change?.currentValue;

    if (!isEmpty(updatedValue)) {
      return this.anchorName$.next(updatedValue);
    }

    this.parseAndSetAnchorNameFromElement();
  }

  private parseAnchorNameIfNoInputValue(): void {
    if (!isNil(this.anchorName)) {
      return;
    }

    this.parseAndSetAnchorNameFromElement();
  }

  private parseAndSetAnchorNameFromElement(): void {
    const parsedAnchorName: Nullable<string> = this.anchorService.parseAnchorNameFromElement(
      this.elementRef.nativeElement
    );
    this.anchorName$.next(parsedAnchorName);
  }

  private destroyAnchor(): void {
    this.anchorName$.next(null);
  }

  private unregisterAnchor(anchorName: string): void {
    this.anchorService.unregisterAnchor(anchorName);
  }

  private registerAnchor(anchorName: string): void {
    this.anchorService.registerAnchor(anchorName, this.elementRef.nativeElement);
  }
}
