import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'textarea-demo/examples';

@Component({
  selector: 'demo-textarea',
  styleUrls: ['./textarea-demo.component.scss'],
  templateUrl: './textarea-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class TextareaDemoComponent implements OnInit, OnDestroy {
  public readonly sizeOptions: PropsOption[] = [
    {
      caption: 'Large',
      value: 'large',
    },
    {
      caption: 'Medium',
      value: 'medium',
      isDefault: true,
    },
  ];

  public readonly counterVisibilityOptions: PropsOption[] = [
    {
      caption: 'Always',
      value: 'always',
      isDefault: true,
    },
    {
      caption: 'Onfocus',
      value: 'onfocus',
    },
    {
      caption: 'Filled',
      value: 'filled',
    },
  ];

  public readonly maxLengthFormControl: FormControl<number> = new FormControl<number>(100);
  public readonly validators$: Observable<ValidatorFn[]> = this.maxLengthFormControl.valueChanges.pipe(
    map((maxLength: number) => [Validators.maxLength(maxLength)]),
    startWith([Validators.maxLength(100)])
  );
  public readonly minRowsFormControl: FormControl<number> = new FormControl<number>(2);
  public readonly maxRowsFormControl: FormControl<number> = new FormControl<number>(5);
  public readonly placeholderFormControl: FormControl<string | null> = new FormControl<string | null>(
    'Custom placeholder'
  );
  public readonly isDisabledFormControl: FormControl<boolean> = new FormControl<boolean>(false);
  public readonly textAreaFormControl: FormControl<string | null> = new FormControl<string | null>(null);
  public readonly textAreaInlineFormControl: FormControl<string | null> = new FormControl<string | null>(null);
  private readonly isDisabled$: Observable<boolean> = this.isDisabledFormControl.statusChanges.pipe(
    map(() => this.isDisabledFormControl.disabled),
    distinctUntilChanged()
  );
  public readonly controlsList: FormControl<string | null>[] = [
    this.textAreaFormControl,
    this.textAreaInlineFormControl,
  ];
  private readonly subscription: Subscription = new Subscription();

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-1/example-1.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-1/example-1.component.ts`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-2/example-2.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-2/example-2.component.ts`,
  };

  public readonly example3Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-3/example-3.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-3/example-3.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-3/example-3.component.ts`,
  };

  public readonly example4Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-4/example-4.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-4/example-4.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-4/example-4.component.ts`,
  };

  public readonly example5Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-5/example-5.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-5/example-5.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-5/example-5.component.ts`,
  };

  public readonly example6Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-6/example-6.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-6/example-6.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-6/example-6.component.ts`,
  };

  public readonly example7Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-7/example-7.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-7/example-7.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-7/example-7.component.ts`,
  };

  public readonly example8Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-8/example-8.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-8/example-8.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-8/example-8.component.ts`,
  };

  public ngOnInit(): void {
    this.subscription.add(this.subscribeToIsDisabled());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private subscribeToIsDisabled(): Subscription {
    return this.isDisabled$.subscribe((isDisabled: boolean) => {
      this.controlsList.forEach((control: FormControl<string | null>) =>
        isDisabled ? control.disable() : control.enable()
      );
    });
  }
}
