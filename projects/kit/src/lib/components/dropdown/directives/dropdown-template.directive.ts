import { HorizontalConnectionPos } from '@angular/cdk/overlay';
import { Directive, Input, OnChanges, TemplateRef } from '@angular/core';
import { DropdownDirectiveParams } from '../../../../internal/declarations/interfaces/dropdown-directive-params.interface';
import { DropdownTemplateContext } from '../../../../internal/declarations/interfaces/dropdown-template-context.interface';
import { DropdownWidthType } from '../../../../internal/declarations/types/dropdown-width.type';
import { DropdownHost } from '../../../../internal/declarations/interfaces/dropdown-host.interface';

@Directive({
  selector: '[pupaDropdownTemplate]',
})
export class DropdownTemplateDirective implements OnChanges {
  @Input() public pupaDropdownTemplate?: DropdownHost;
  @Input() public pupaDropdownTemplateWidthType: DropdownWidthType = 'auto';
  @Input() public pupaDropdownTemplateHorizontalPosition: HorizontalConnectionPos = 'start';

  private get dropdownDirectiveParams(): DropdownDirectiveParams {
    return {
      templateRef: this.templateRef,
      widthType: this.pupaDropdownTemplateWidthType,
      horizontalPosition: this.pupaDropdownTemplateHorizontalPosition,
    };
  }

  constructor(private readonly templateRef: TemplateRef<DropdownTemplateContext>) {}

  public ngOnChanges(): void {
    this.pupaDropdownTemplate?.setDropdownParams(this.dropdownDirectiveParams);
  }
}
