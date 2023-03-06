import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/* cSpell:disable */
const BODY_CONTENT: string = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis erat metus, 
tempus quis cursus sit amet, aliquam tempor odio. Proin vehicula nibh vitae varius tristique. 
Vivamus id vestibulum risus. Nulla eget leo eget est venenatis luctus in quis lectus. 
Maecenas pulvinar sollicitudin diam dapibus scelerisque. Ut non elit viverra, fringilla arcu et, 
blandit arcu. Suspendisse potenti. Phasellus ut malesuada tellus. Ut ac justo eget orci interdum 
euismod et vitae tortor. Donec at ipsum iaculis, lobortis sapien eget, rutrum lacus. 
Vivamus id blandit ex. Integer suscipit velit quis sem aliquet maximus. 
Vivamus facilisis molestie tellus, et rhoncus neque vestibulum vel.
Phasellus porttitor elit lorem, quis luctus ex aliquam non.

Donec porttitor nisi massa, in maximus diam tincidunt id. Nullam scelerisque enim malesuada tortor aliquam placerat. 
Praesent lacus dolor, molestie in ullamcorper sit amet, faucibus non purus. Aliquam eu dapibus nibh, nec varius elit. 
Nulla dapibus purus odio, nec interdum urna accumsan sed. Etiam vitae dignissim magna. 
Nulla posuere enim tempus tincidunt gravida. In hac habitasse platea dictumst. Proin tempor efficitur dolor et 
fringilla. Praesent dolor tellus, interdum quis cursus elementum, vestibulum eget sem. In eu consequat neque. 
Aliquam erat volutpat. Integer iaculis viverra mi, ac ultrices nibh consectetur ac.
`;
/* cSpell:enable */

@Component({
  selector: 'pupa-modal-demo-example-5',
  templateUrl: './modal-demo-example-5.component.html',
  styleUrls: ['./modal-demo-example-5.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ModalDemoExample5Component {
  public readonly loremIpsum: string = BODY_CONTENT;
}
