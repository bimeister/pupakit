import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ModalSize = 'large' | 'medium' | 'small';

export enum ModalState {
  Appeared = 'Appeared',
  Dissapeared = 'Dissapeared',
  Void = 'Void'
}

const ANIMATION_TIME_S: number = 0.32;
const MS_IN_S: number = 1000;

@Component({
  selector: 'pupa-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('overlayAppeared', [
      state(
        ModalState.Void,
        style({
          opacity: '0'
        })
      ),
      state(
        ModalState.Dissapeared,
        style({
          opacity: '0'
        })
      ),
      state(
        ModalState.Appeared,
        style({
          opacity: '1'
        })
      ),
      transition('* => *', animate(`${ANIMATION_TIME_S}s cubic-bezier(0.2, 1, 1, 1)`))
    ])
  ]
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() public clickableOverlay: boolean = true;
  @Input() public closeButton: boolean = true;
  @Input() public size: ModalSize = 'medium';
  @Input() public title: string = null;

  @Input() public set open(v: boolean) {
    if (v) {
      this.openModal();
    } else {
      this.closeModal();
    }
  }

  public isOpen: boolean = false; // Только для шаблона

  @Output() public readonly close: EventEmitter<void> = new EventEmitter<void>();

  public readonly overlayAnimationState$: BehaviorSubject<ModalState> = new BehaviorSubject<ModalState>(
    ModalState.Appeared
  );

  constructor(private readonly renderer: Renderer2, private readonly cd: ChangeDetectorRef) {}

  @HostListener('window:keydown', ['$event'])
  public processWindowKeypress(event: KeyboardEvent): void {
    const isEscPressed: boolean = event.key.toLowerCase() === 'escape';
    if (isEscPressed) {
      this.close.emit();
    }
  }

  private openModal(): void {
    this.isOpen = true;
    requestAnimationFrame(() => this.overlayAnimationState$.next(ModalState.Appeared));
  }

  private closeModal(): void {
    this.overlayAnimationState$.next(ModalState.Dissapeared);
    setTimeout(() => {
      this.isOpen = false;
      this.cd.markForCheck();
    }, ANIMATION_TIME_S * MS_IN_S);
  }

  public ngOnInit(): void {
    this.disableScrolling();
  }

  public ngOnDestroy(): void {
    this.enableScrolling();
  }

  public processOverlayClick(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.clickableOverlay) {
      return;
    }
    this.close.emit();
  }

  public processCloseButtonClick(event: MouseEvent): void {
    event.stopPropagation();
    this.close.emit();
  }

  private disableScrolling(): void {
    this.renderer.setStyle(globalThis.document.body, 'overflow', 'hidden');
  }

  private enableScrolling(): void {
    this.renderer.removeStyle(globalThis.document.body, 'overflow');
  }
}
