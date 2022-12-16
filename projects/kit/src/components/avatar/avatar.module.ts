import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PupaPipesModule } from '@bimeister/pupakit.common';
import { mdPersonIcon, PupaIconsModule } from '@bimeister/pupakit.icons';
import { AvatarComponent } from './components/avatar/avatar.component';

@NgModule({
  declarations: [AvatarComponent],
  exports: [AvatarComponent],
  imports: [CommonModule, PupaIconsModule.forFeature([mdPersonIcon]), PupaPipesModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PupaAvatarModule {}
