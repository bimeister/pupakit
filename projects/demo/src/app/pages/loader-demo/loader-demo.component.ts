import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoaderKind, Loader } from '@bimeister/pupakit.common';
import { PropsOption } from 'src/app/shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_EXAMPLE_URL: string = 'loader-demo/examples';

@Component({
  selector: 'demo-loader-demo',
  templateUrl: './loader-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderDemoComponent {
  public readonly typeFormControl: FormControl<Loader> = new FormControl<Loader>('determinate');
  public readonly kindFormControl: FormControl<LoaderKind> = new FormControl<LoaderKind>('default');
  public readonly sizeFormControl: FormControl<number | null> = new FormControl<number | null>(12.5);
  public readonly progressFormControl: FormControl<number | null> = new FormControl<number | null>(50, [
    Validators.required,
    Validators.min(0),
    Validators.max(100),
  ]);
  public readonly isErrorFormControl: FormControl<boolean> = new FormControl<boolean>(false);
  public readonly errorTextFormControl: FormControl<string | null> = new FormControl<string | null>(
    'Loader error text'
  );

  public readonly typeOptions: PropsOption[] = [
    {
      caption: 'determinate',
      value: 'determinate',
      isDefault: true,
    },
    {
      caption: 'indeterminate',
      value: 'indeterminate',
    },
  ];

  public readonly kindOptions: PropsOption[] = [
    {
      caption: 'default',
      value: 'default',
      isDefault: true,
    },
    {
      caption: 'success',
      value: 'success',
    },
    {
      caption: 'warning',
      value: 'warning',
    },
    {
      caption: 'danger',
      value: 'danger',
    },
  ];

  public readonly loaderExampleContent: Record<string, string> = {
    HTML: `${BASE_EXAMPLE_URL}/demo-loader/demo-loader.component.html`,
    SCSS: `${BASE_EXAMPLE_URL}/demo-loader/demo-loader.component.scss`,
  };
  public readonly loaderOldExampleContent: Record<string, string> = {
    HTML: `${BASE_EXAMPLE_URL}/demo-loader-old/demo-loader-old.component.html`,
  };
}
