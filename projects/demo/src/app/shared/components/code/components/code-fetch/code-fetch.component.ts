import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { isEmpty } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ExamplesRequestsService } from '../../../../services/requests/examples-request.service';

@Component({
  selector: 'pupa-code-fetch',
  templateUrl: './code-fetch.component.html',
  styleUrls: ['./code-fetch.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeFetchComponent implements OnChanges {
  @Input() public codeFilePath: string = '';
  public readonly code$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private readonly examplesRequestsService: ExamplesRequestsService) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processCodeFilePathChange(changes?.codeFilePath);
  }

  private processCodeFilePathChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (isEmpty(updatedValue)) {
      return;
    }

    this.processRequestCode(updatedValue);
  }

  private processRequestCode(codeUrl: string): void {
    this.examplesRequestsService
      .getExampleRawFile(codeUrl)
      .pipe(take(1))
      .subscribe((code: string) => this.code$.next(code.trim()));
  }
}
