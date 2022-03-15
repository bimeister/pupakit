import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { PopoverComponentBase } from '@kit/internal/declarations/classes/abstract/popover-component-base.abstract';
import { Theme } from '@kit/internal/declarations/enums/theme.enum';
import { PopoverRef } from '@kit/internal/declarations/classes/popover-ref.class';
import { ThemeWrapperService } from '@kit/lib/components/theme-wrapper/services/theme-wrapper.service';

interface PopoverContentData {
  title: string;
  buttonAction: VoidFunction;
}

@Component({
  selector: 'demo-popover-layout-basic',
  templateUrl: './popover-layout-basic.component.html',
  styleUrls: ['./popover-layout-basic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PopoverLayoutBasicComponent extends PopoverComponentBase<PopoverContentData, void> {
  public readonly title: string = this.data.title ?? '';
  public readonly theme$: Observable<Theme> = this.themeWrapperService.theme$;

  constructor(
    public readonly popoverRef: PopoverRef<PopoverContentData, void>,
    private readonly themeWrapperService: ThemeWrapperService
  ) {
    super(popoverRef);
  }

  public buttonClick(): void {
    this.data.buttonAction();
  }
}
