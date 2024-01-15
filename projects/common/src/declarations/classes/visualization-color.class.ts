import { VisualizationColorsConfig } from '../interfaces/visualization-colors-config.interface';

const DARK_THEME_PREFIX: string = 'dark-';

export class VisualizationColor {
  public readonly name: string = `${this.categoryName}-${this.groupName.replace(' ', '-')}-${
    this.configuration.name
  }`.toLowerCase();

  public readonly isLight: boolean = this.getIsLight();

  public readonly lightColorHex: string = this.configuration.lightColor.toLowerCase();
  public readonly darkColorHex: string = this.configuration.darkColor.toLowerCase();
  public readonly lightColorRgb: [number, number, number] = this.getRgb(this.lightColorHex);
  public readonly darkColorRgb: [number, number, number] = this.getRgb(this.darkColorHex);
  public readonly lightColorFormattedRgb: string = this.getFormattedRgb(this.lightColorRgb);
  public readonly darkColorFormattedRgb: string = this.getFormattedRgb(this.darkColorRgb);

  public readonly lightColor: VisualizationColorsConfig.ParsedConfigurationValue = {
    name: this.name,
    value: this.lightColorHex,
  };

  public readonly darkColor: VisualizationColorsConfig.ParsedConfigurationValue = {
    name: DARK_THEME_PREFIX + this.name,
    value: this.darkColorHex,
  };

  constructor(
    private readonly configuration: VisualizationColorsConfig.Configuration,
    private readonly groupName: string,
    private readonly categoryName: string
  ) {}

  public getAsCssValue(isDark: boolean): string {
    return `rgba(var(--color_${isDark ? this.darkColor.name : this.lightColor.name}))`;
  }

  private getRgb(hex: string): [number, number, number] {
    return [parseInt(hex.substring(0, 2), 16), parseInt(hex.substring(2, 4), 16), parseInt(hex.substring(4, 6), 16)];
  }

  private getFormattedRgb(rgb: [number, number, number]): string {
    return `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
  }

  private getIsLight(): boolean {
    return Number(this.configuration.name) <= 400;
  }
}
