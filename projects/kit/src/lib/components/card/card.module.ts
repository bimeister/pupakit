import { NgModule, Type } from '@angular/core';
import { CardHeaderComponent } from './components/card-header/card-header.component';
import { CardActionComponent } from './components/card-action/card-action.component';
import { CardCoverComponent } from './components/card-cover/card-cover.component';
import { CardDescriptionComponent } from './components/card-description/card-description.component';
import { CardTitleComponent } from './components/card-title/card-title.component';
import { CardComponent } from './components/card/card.component';
import { SharedModule } from '../../../internal/shared/shared.module';
import { IconModule } from '../icon/icon.module';
import { CardContainerComponent } from './components/card-container/card-container.component';

const COMPONENTS: Type<unknown>[] = [
  CardComponent,
  CardCoverComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardActionComponent,
  CardContainerComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [SharedModule, IconModule],
  exports: [...COMPONENTS],
})
export class CardModule {}
