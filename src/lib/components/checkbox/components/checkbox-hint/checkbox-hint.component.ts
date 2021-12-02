import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CheckboxService } from '../../services/checkbox.service';

@Component({
  selector: 'pupa-checkbox-hint',
  templateUrl: './checkbox-hint.component.html',
  styleUrls: ['./checkbox-hint.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxHintComponent {
  public readonly disabled$: BehaviorSubject<boolean> = this.checkboxService.disabled$;

  constructor(private readonly checkboxService: CheckboxService) {}
}
