import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CheckboxService } from '../../services/checkbox.service';

@Component({
  selector: 'pupa-checkbox-label',
  templateUrl: './checkbox-label.component.html',
  styleUrls: ['./checkbox-label.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxLabelComponent {
  public readonly disabled$: BehaviorSubject<boolean> = this.checkboxService.disabled$;

  constructor(private readonly checkboxService: CheckboxService) {
    this.checkboxService.withLabel$.next(true);
  }
}
