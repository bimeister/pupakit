import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Breadcrumb } from '@bimeister/pupakit.kit';
import { getUuid } from '@bimeister/utilities';

function repeatTextByNumber(text: string, repeatNumber: number = 1): string {
  const serializedText: string = `${text} `;
  return serializedText.repeat(repeatNumber).trim();
}

@Component({
  selector: 'demo-breadcrumbs-example-2',
  templateUrl: './example-2.component.html',
  styleUrls: ['./example-2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsExample2Component {
  public readonly breadcrumbs: Breadcrumb[] = Array(10)
    .fill(undefined)
    .map((_item: undefined, itemIndex: number) => ({
      name: repeatTextByNumber(`Breadcrumb ${itemIndex + 1}`, 2),
      id: getUuid(),
      routerLink: '/kit/breadcrumbs',
    }));
}
