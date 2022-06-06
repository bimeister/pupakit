import { ChangeDetectionStrategy, Component, Optional, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Nullable } from '@bimeister/utilities';
import { PopoverRef } from '../../../../../internal/declarations/classes/popover-ref.class';
import { PopoverTemplateData } from '../../../../../internal/declarations/interfaces/popover-template-data.interface';
import { ThemeWrapperService } from '../../../../../lib/components/theme-wrapper/services/theme-wrapper.service';
import { PopoverComponentBase } from '../../../../../internal/declarations/classes/abstract/popover-component-base.abstract';
import { Observable, of } from 'rxjs';
import { Theme } from '../../../../../internal/declarations/enums/theme.enum';

@Component({
  selector: 'pupa-popover-template',
  templateUrl: './popover-template.component.html',
  styleUrls: ['./popover-template.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverTemplateComponent<TContext> extends PopoverComponentBase<PopoverTemplateData<TContext>, void> {
  public readonly templateRef: Nullable<TemplateRef<unknown>> = this.data.templateRef;
  public readonly templateContext: TContext = {
    ...this.data.templateContext,
    popoverRef: this.popoverRef,
  };

  public readonly theme$: Observable<Theme> = this.themeWrapperService?.theme$ ?? of(Theme.Light);

  constructor(
    popoverRef: PopoverRef<PopoverTemplateData<TContext>, void>,
    @Optional() private readonly themeWrapperService?: ThemeWrapperService
  ) {
    super(popoverRef);
  }
}
