import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { ToastsService } from '@bimeister/pupakit.overlays';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { ExamplesRequestsService } from '../../../../services/requests/examples-request.service';

@Component({
  selector: 'pupa-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeComponent implements OnChanges {
  @Input() public code: string = '';
  @Input() public filePath: string = '';

  public readonly code$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private readonly cdkClipboard: Clipboard,
    private readonly examplesRequestsService: ExamplesRequestsService,
    private readonly toastsService: ToastsService
  ) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processCodeChange(changes?.code);
    this.processFilePathChange(changes?.filePath);
  }

  public copyToClipBoard(code: string): void {
    this.cdkClipboard.copy(code);
    this.toastsService.open({
      data: {
        bodyText: 'Copied to clipboard',
        type: 'info',
      },
    });
  }

  private processCodeChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.code$.next(updatedValue.trim());
  }

  private processFilePathChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.examplesRequestsService.getExampleRawFile(this.filePath).subscribe((code: string) => this.code$.next(code));
  }
}
