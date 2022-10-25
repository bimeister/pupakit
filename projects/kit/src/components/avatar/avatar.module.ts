import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PupaPipesModule } from '@bimeister/pupakit.common';
import { PupaIconsModule, mdPersonIcon } from '@bimeister/pupakit.icons';
import { PupaIconModule } from '../icon/icon.module';
import { AvatarComponent } from './components/avatar/avatar.component';

@NgModule({
  declarations: [AvatarComponent],
  exports: [AvatarComponent],
  imports: [CommonModule, PupaIconModule, PupaIconsModule.forFeature([mdPersonIcon]), PupaPipesModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PupaAvatarModule {}
