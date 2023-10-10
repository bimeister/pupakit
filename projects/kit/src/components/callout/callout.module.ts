import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaButtonsModule } from '../buttons/buttons.module';
import { CalloutComponent } from './components/callout/callout.component';
import { CalloutHeaderComponent } from './components/callout-header/callout-header.component';
import { CalloutActionsComponent } from './components/callout-actions/callout-actions.component';
import { CalloutBodyComponent } from './components/callout-body/callout-body.component';
import { CalloutFooterComponent } from './components/callout-footer/callout-footer.component';
import { CalloutFooterRowComponent } from './components/callout-footer-row/callout-footer-row.component';
import { CalloutCloseButtonComponent } from './components/callout-close-button/callout-close-button.component';
import { CalloutCollapseButtonComponent } from './components/callout-collapse-button/callout-collapse-button.component';

const COMPONENTS: Type<unknown>[] = [
  CalloutComponent,
  CalloutHeaderComponent,
  CalloutActionsComponent,
  CalloutBodyComponent,
  CalloutFooterComponent,
  CalloutFooterRowComponent,
  CalloutCloseButtonComponent,
  CalloutCollapseButtonComponent,
];

@NgModule({
  declarations: COMPONENTS,
  exports: COMPONENTS,
  imports: [PupaIconsModule, PupaButtonsModule, CommonModule],
})
export class PupaCalloutModule {}
