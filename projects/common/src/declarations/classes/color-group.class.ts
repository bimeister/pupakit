import { type ColorsConfig } from '../interfaces/colors-config.interface';
import { Color } from './color.class';

export class ColorGroup {
  public readonly name: string = this.groupData.name;
  public readonly colors: Color[] = this.groupData.colors.map((colorData: ColorsConfig.Color) => new Color(colorData));

  constructor(private readonly groupData: ColorsConfig.Group) {}
}
