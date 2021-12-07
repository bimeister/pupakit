import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-select-demo-tags-container-example',
  templateUrl: './select-demo-tags-container-example.component.html',
  styleUrls: ['./select-demo-tags-container-example.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectDemoTagsContainerExampleComponent {
  public readonly tags: string[] = Array(30)
    .fill(null)
    .map((_, index: number) => `Tag ${index}`);
}
