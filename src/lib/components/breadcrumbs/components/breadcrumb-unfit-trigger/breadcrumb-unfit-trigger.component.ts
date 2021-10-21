import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { filterTruthy } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'pupa-breadcrumb-unfit-trigger',
  templateUrl: './breadcrumb-unfit-trigger.component.html',
  styleUrls: ['./breadcrumb-unfit-trigger.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbUnfitTriggerComponent {
  @Input() public active: boolean = false;

  @ViewChild('trigger') private readonly triggerRef: ElementRef<HTMLElement>;

  public readonly isFocused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public onKeyDown(_event: MouseEvent): void {
    this.isFocused$.pipe(take(1), filterTruthy()).subscribe(() => {
      this.triggerRef.nativeElement?.click();
    });
  }

  public handleFocusEvent(): void {
    this.isFocused$.next(true);
  }

  public handleBlurEvent(): void {
    this.isFocused$.next(false);
  }
}
