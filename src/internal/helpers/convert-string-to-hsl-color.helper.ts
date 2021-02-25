import { isEmpty, isNil } from '@bimeister/utilities';
import { HslColor } from '../declarations/interfaces/hsl-color.interface';
import { clamp } from './clamp.helper';

const DEFAULT_HSL_COLOR: HslColor = { h: 87, s: 70, l: 50 };
const MAX_VALUE: number = 100;
const MIN_VALUE: number = 0;

export function convertStringToHslColor(
  inputString: string,
  saturation: number = DEFAULT_HSL_COLOR.s,
  lightness: number = DEFAULT_HSL_COLOR.l
): HslColor {
  if (isNil(inputString) || typeof inputString !== 'string') {
    return DEFAULT_HSL_COLOR;
  }

  const isSaturationIncorrect: boolean = isNil(saturation) || Number.isNaN(saturation);
  const isLightnessIncorrect: boolean = isNil(saturation) || Number.isNaN(saturation);

  const serializedSaturation: number = isSaturationIncorrect
    ? DEFAULT_HSL_COLOR.s
    : clamp(saturation, MIN_VALUE, MAX_VALUE);
  const serializedLightness: number = isLightnessIncorrect
    ? DEFAULT_HSL_COLOR.l
    : clamp(lightness, MIN_VALUE, MAX_VALUE);

  const charCodes: number[] = Array.from(inputString).map((char: string) => char.charCodeAt(0));

  const hash: number = isEmpty(charCodes)
    ? DEFAULT_HSL_COLOR.h
    : charCodes.reduce((accumulator: number, currentChar: number) => {
        return currentChar + (accumulator * 32 - accumulator);
      });
  const serializedHash: number = hash % 360;

  return { h: serializedHash, s: serializedSaturation, l: serializedLightness };
}
