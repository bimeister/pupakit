import { ElementRef } from '@angular/core';

import { isNullOrUndefined } from './is-null-or-undefined.helper';

type FunctionSignature = (inputElementRef: ElementRef<HTMLInputElement>) => void;

export const focusOnInput: FunctionSignature = (inputElementRef: ElementRef<HTMLInputElement>): void => {
  if (isNullOrUndefined(inputElementRef) || isNullOrUndefined(inputElementRef.nativeElement)) {
    return;
  }
  inputElementRef.nativeElement.focus();
};
