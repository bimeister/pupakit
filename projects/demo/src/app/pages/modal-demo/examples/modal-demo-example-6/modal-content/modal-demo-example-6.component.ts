import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

const BODY_CONTENT: string = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis erat metus, 
tempus quis cursus sit amet, aliquam tempor odio. Proin vehicula nibh vitae varius tristique. 
Vivamus id vestibulum risus. Nulla eget leo eget est venenatis luctus in quis lectus. 
Maecenas pulvinar sollicitudin diam dapibus scelerisque. Ut non elit viverra, fringilla arcu et, 
blandit arcu. Phasellus ut malesuada tellus. Ut ac justo eget orci interdum euismod et vitae tortor.
`;

@Component({
  selector: 'pupa-modal-demo-example-6',
  templateUrl: './modal-demo-example-6.component.html',
  styleUrls: ['./modal-demo-example-6.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ModalDemoExample6Component {
  public readonly loremIpsum: string = BODY_CONTENT;
}
