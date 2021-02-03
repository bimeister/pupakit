import { Injectable } from '@angular/core';
import { isNil } from '@bimeister/utilities';

@Injectable({ providedIn: 'root' })
export class BrowserService {
  public readonly userAgent: string = window.navigator.userAgent.toLowerCase();

  public get isChrome(): boolean {
    return !Object.is(this.userAgent.indexOf('chrome'), -1) && !isNil(window['chrome']);
  }
}
