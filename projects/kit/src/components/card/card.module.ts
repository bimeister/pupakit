import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { PupaIconsModule } from '@bimeister/pupakit.icons';
import { CardActionComponent } from './components/card-action/card-action.component';
import { CardContainerComponent } from './components/card-container/card-container.component';
import { CardCoverComponent } from './components/card-cover/card-cover.component';
import { CardDescriptionComponent } from './components/card-description/card-description.component';
import { CardHeaderComponent } from './components/card-header/card-header.component';
import { CardTitleComponent } from './components/card-title/card-title.component';
import { CardComponent } from './components/card/card.component';

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
  imports: [CommonModule, PupaIconsModule],
  exports: [...COMPONENTS],
})
export class PupaCardModule {}
