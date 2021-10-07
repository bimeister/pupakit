import { ChangeDetectionStrategy, Component } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckboxService } from '../../services/checkbox.service';

@Component({
  selector: 'pupa-checkbox-mark',
  templateUrl: './checkbox-mark.component.html',
  styleUrls: ['./checkbox-mark.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxMarkComponent {
  public readonly disabled$: BehaviorSubject<boolean> = this.checkboxService.disabled$;

  public readonly value$: BehaviorSubject<boolean> = this.checkboxService.value$;

  public readonly indeterminate$: BehaviorSubject<boolean> = this.checkboxService.indeterminate$;
  public readonly withLabel$: BehaviorSubject<boolean> = this.checkboxService.withLabel$;

  public readonly resultClassList$: Observable<string[]> = combineLatest([
    this.disabled$,
    this.value$,
    this.indeterminate$
  ]).pipe(
    map(([disabled, value, indeterminate]: [boolean, boolean, boolean]) => {
      const disabledStateClass: string = disabled ? 'checkbox_disabled' : null;
      const hasMarkerClass: string = value || indeterminate ? 'checkbox_with-marker' : null;
      return [disabledStateClass, hasMarkerClass].filter((innerClassName: string) => !isNil(innerClassName));
    })
  );

  constructor(private readonly checkboxService: CheckboxService) {}
}
