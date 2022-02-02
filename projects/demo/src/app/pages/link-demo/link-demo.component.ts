import { Component } from '@angular/core';

const BASE_REQUEST_PATH: string = 'link-demo/examples';
@Component({
  selector: 'demo-link-demo',
  templateUrl: './link-demo.component.html',
  styleUrls: ['./link-demo.component.scss'],
})
export class LinkDemoComponent {
  public readonly basicExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/basic-example/basic-example.component.html`,
  };

  public readonly buttonAsLinkExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/button-as-link-example/button-as-link-example.component.html`,
  };
}
