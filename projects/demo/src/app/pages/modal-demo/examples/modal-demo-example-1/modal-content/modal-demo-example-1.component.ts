import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Theme } from '@kit/internal/declarations/api';
import { ThemeWrapperService } from '@kit/lib/components/theme-wrapper/services/theme-wrapper.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'pupa-modal-demo-example-1',
  templateUrl: './modal-demo-example-1.component.html',
  styleUrls: ['./modal-demo-example-1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ModalDemoExample1Component {
  public readonly theme$: Observable<Theme> = this.themeWrapperService.theme$;

  constructor(private readonly themeWrapperService: ThemeWrapperService) {}
}
