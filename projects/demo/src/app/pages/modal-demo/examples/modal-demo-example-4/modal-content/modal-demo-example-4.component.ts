import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Theme } from '@kit/internal/declarations/api';
import { ThemeWrapperService } from '@kit/lib/components/theme-wrapper/services/theme-wrapper.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'pupa-modal-demo-example-4',
  templateUrl: './modal-demo-example-4.component.html',
  styleUrls: ['./modal-demo-example-4.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ModalDemoExample4Component {
  public readonly theme$: Observable<Theme> = this.themeWrapperService.theme$;

  constructor(private readonly themeWrapperService: ThemeWrapperService) {}
}
