import { NgModule, Type } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { TypographyMixinsComponent } from './examples/example-mixins/example-mixins.component';
import { TypographyPresetsComponent } from './examples/example-presets/example-presets.component';
import { TypographyPageRoutingModule } from './typography-page-routing.module';
import { TypographyPageComponent } from './typography-page.component';

const EXAMPLES: Type<unknown>[] = [TypographyPresetsComponent, TypographyMixinsComponent];
const COMPONENTS: Type<unknown>[] = [TypographyPageComponent, ...EXAMPLES];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: DECLARATIONS,
  imports: [DemoSharedModule, TypographyPageRoutingModule],
})
export class TypographyPageModule {}
