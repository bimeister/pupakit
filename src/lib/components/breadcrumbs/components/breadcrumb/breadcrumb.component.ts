import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { filterTruthy, Nullable } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { BreadcrumbContext } from '../../../../../internal/declarations/interfaces/breadcrumb-context.interface';
import { Breadcrumb } from '../../../../../internal/declarations/interfaces/breadcrumb.interface';

@Component({
  selector: 'pupa-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent {
  @Input() public breadcrumb: Nullable<Breadcrumb> = null;
  @Input() public active: boolean = false;
  @Input() public template: TemplateRef<BreadcrumbContext>;

  @ViewChild('breadcrumb') private readonly breadcrumbRef: ElementRef<HTMLElement>;

  public readonly isFocused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public onKeyDown(_event: MouseEvent): void {
    this.isFocused$.pipe(take(1), filterTruthy()).subscribe(() => {
      this.breadcrumbRef.nativeElement?.click();
    });
  }

  public handleFocusEvent(): void {
    this.isFocused$.next(true);
  }

  public handleBlurEvent(): void {
    this.isFocused$.next(false);
  }
}
