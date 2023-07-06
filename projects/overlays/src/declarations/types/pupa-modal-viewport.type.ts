import { ElementRef } from '@angular/core';
import { PupaModalViewportRect } from '../interfaces/pupa-modal-viewport-rect.interface';

export type PupaModalViewport = ElementRef<HTMLElement> | HTMLElement | PupaModalViewportRect;
