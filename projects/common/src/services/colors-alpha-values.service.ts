import { Injectable } from '@angular/core';
import config from '../assets/configs/alpha-colors-config.json';
import { ColorsAlphaValuesConfig } from '../declarations/interfaces/colors-alpha-values-config.interface';

@Injectable({ providedIn: 'root' })
export class ColorsAlphaValuesService {
  public readonly config: ColorsAlphaValuesConfig.AlphaValue[] = config;
}
