import { ColorsConfig } from '../interfaces/colors-config.interface';

const LIGHT_OFFSET: number = 1.61;

export class Color {
  public readonly name: string = this.colorData.name;
  public readonly hex: string = this.colorData.hex.toLowerCase();
  public readonly rgb: [number, number, number] = this.getRgb();
  public readonly formattedRgb: string = this.getFormattedRgb();
  public readonly key: string = this.getFormattedKey();
  public readonly isLight: boolean = this.getIsLight();

  constructor(private readonly colorData: ColorsConfig.Color) {}

  public getAsCssValue(alpha: number = 1): string {
    return `rgba(var(--color_${this.key}), ${alpha})`;
  }

  private getRgb(): [number, number, number] {
    return [
      parseInt(this.hex.substring(0, 2), 16),
      parseInt(this.hex.substring(2, 4), 16),
      parseInt(this.hex.substring(4, 2), 16),
    ];
  }

  private getFormattedRgb(): string {
    return `${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]}`;
  }

  private getFormattedKey(): string {
    return this.name.replaceAll('/', '-').toLowerCase();
  }

  private getIsLight(): boolean {
    return this.rgb[0] + this.rgb[1] + this.rgb[2] > 255 * LIGHT_OFFSET;
  }
}
