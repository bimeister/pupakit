import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-uploads',
  styleUrls: ['../demo.scss', './uploads-demo.component.scss'],
  templateUrl: './uploads-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadsDemoComponent {
  public fileAttachments: any[] = new Array(1000).fill({}).map(() => ({
    name: 'File name.pdf',
    size: 10,
    status: 'uploading',
    percentage: Math.random() * 101,
  }));

  constructor() {
    this.fileAttachments[0].status = 'error';
  }

  public add(): void {
    this.fileAttachments = [
      {
        name: 'File name.pdf',
        size: 10,
        status: 'pending',
        percentage: Math.random() * 101,
      },
      ...this.fileAttachments,
    ];
  }
}
