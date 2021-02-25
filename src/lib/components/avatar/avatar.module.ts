import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { mdPersonIcon } from '../../../internal/constants/icons/md-person-icon.const';
import { SharedModule } from '../../../internal/shared/shared.module';
import { IconModule } from '../icon/icon.module';
import { AvatarComponent } from './components/avatar/avatar.component';

@NgModule({
  declarations: [AvatarComponent],
  exports: [AvatarComponent],
  imports: [SharedModule, IconModule.forFeature([mdPersonIcon])],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AvatarModule {}
