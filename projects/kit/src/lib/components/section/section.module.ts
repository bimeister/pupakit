import { NgModule, Type } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { SectionContainerComponent } from './components/section-container/section-container.component';
import { SectionSubTitleComponent } from './components/section-sub-title/section-sub-title.component';
import { SectionTitleComponent } from './components/section-title/section-title.component';

const COMPONENTS: Type<unknown>[] = [SectionContainerComponent, SectionTitleComponent, SectionSubTitleComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [SharedModule],
  exports: [COMPONENTS],
})
export class SectionModule {}
