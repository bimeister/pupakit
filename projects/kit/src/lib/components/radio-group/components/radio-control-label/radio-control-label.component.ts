import { ChangeDetectionStrategy, Component, Host, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';

import { RadioControlComponent } from '../radio-control/radio-control.component';

@Component({
  selector: 'pupa-radio-control-label',
  templateUrl: './radio-control-label.component.html',
  styleUrls: ['./radio-control-label.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioControlLabelComponent<T> {
  public readonly isSelected$: Observable<boolean> = this.radioControlComponent.isSelected$;
  public readonly isHovered$: Observable<boolean> = this.radioControlComponent.isHovered$;
  public readonly isDisabled$: Observable<boolean> = this.radioControlComponent.isDisabled$;

  constructor(@Host() private readonly radioControlComponent: RadioControlComponent<T>) {}
}
