import { ChangeDetectionStrategy, Component, TemplateRef, ViewEncapsulation } from '@angular/core';
import { DropdownTemplateContext } from '../../../../declarations/interfaces/dropdown-template-context.interface';
import { DropdownComponentBase } from '../../../../declarations/classes/abstract/dropdown-component-base.abstract';
import { DropdownTemplateData } from '../../../../declarations/interfaces/dropdown-template-data.interface';

@Component({
  selector: 'pupa-dropdown-template',
  templateUrl: './dropdown-template.component.html',
  styleUrls: ['./dropdown-template.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: DropdownComponentBase.animations,
})
export class DropdownTemplateComponent<TContext> extends DropdownComponentBase<DropdownTemplateData<TContext>> {
  public readonly templateRef: TemplateRef<TContext> = this.data?.templateRef;
  public readonly templateContext: DropdownTemplateContext = { $implicit: this.dropdownRef };
}
