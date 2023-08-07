import { Injectable } from '@angular/core';
import { isNil, type Nullable } from '@bimeister/utilities';
import config from '../assets/configs/colors-config.json';
import { ColorGroup } from '../declarations/classes/color-group.class';
import { Color } from '../declarations/classes/color.class';
import { type ColorsConfig } from '../declarations/interfaces/colors-config.interface';

@Injectable({ providedIn: 'root' })
export class ColorsService {
  private readonly config: ColorsConfig.Group[] = config;

  public readonly colorGroups: ColorGroup[] = this.config.map(
    (groupData: ColorsConfig.Group) => new ColorGroup(groupData)
  );
  public readonly colors: Color[] = this.colorGroups.map((colorGroup: ColorGroup) => colorGroup.colors).flat(1);

  private readonly colorsMap: Map<string, Color> = new Map<string, Color>(
    this.colors.map((color: Color) => [color.key, color])
  );

  public getColorByKey(key: string): Color {
    const color: Nullable<Color> = this.colorsMap.get(key);

    if (isNil(color)) {
      throw new Error(`[PupaKit.ColorsService] Color with key '${key}' does not exist.`);
    }

    return color;
  }
}
