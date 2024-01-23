import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { getUuid, Uuid } from '@bimeister/utilities';

@Component({
  selector: 'demo-avatar-background-seed-example',
  templateUrl: './demo-avatar-background-seed-example.component.html',
  styleUrls: ['./demo-avatar-background-seed-example.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarBackgroundSeedExampleComponent {
  public readonly userId: Uuid = getUuid();
  public readonly userName: string = 'User user';
  public readonly iconName: string = 'app-user-group';
}
