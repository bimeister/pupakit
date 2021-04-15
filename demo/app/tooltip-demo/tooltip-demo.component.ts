import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'demo-tooltip',
  templateUrl: './tooltip-demo.component.html',
  styleUrls: ['./tooltip-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipDemoComponent {
  public readonly hideOnTooltipHoverControl: FormControl = new FormControl(true);
  public readonly disabledControl: FormControl = new FormControl(false);

  private readonly defaultContent: string = `
    <div>
      Таким образом новая модель организационной деятельности способствует подготовке и реализации систем массового
      участия. Таким образом реализация намеченных плановых заданий позволяет оценить значение новых предложений.
    </div>
    <div>
      С другой стороны рамки и место обучения кадров способствует подготовке и реализации модели развития. Идейные
      соображения высшего порядка, а также дальнейшее развитие различных форм деятельности позволяет оценить
      значение новых предложений. Товарищи! постоянное информационно-пропагандистское обеспечение нашей деятельности
      позволяет выполнять важные задания по разработке модели развития. Таким образом новая модель организационной
      деятельности способствует подготовке и реализации систем массового участия. С другой стороны укрепление и
      развитие структуры обеспечивает участие в формировании дальше какой-то там текст за тремя точками
    </div>
  `;

  public readonly contentControl: FormControl = new FormControl(this.defaultContent.trim());
  public readonly sanitiazedHtml$: Observable<SafeHtml> = this.contentControl.valueChanges.pipe(
    startWith(this.contentControl.value),
    map((content: string) => this.domSanitiazer.bypassSecurityTrustHtml(content))
  );

  constructor(private readonly domSanitiazer: DomSanitizer) {}
}
