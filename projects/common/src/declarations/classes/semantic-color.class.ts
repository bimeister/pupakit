import { type SemanticColorsConfig } from '../interfaces/semantic-colors-config.interface';

export class SemanticColor {
  public readonly name: string = `${this.groupName}-${this.configuration.name}`.toLowerCase();
  public readonly lightColorName: string = this.configuration.lightColor.color.toLowerCase();
  public readonly darkColorName: string = this.configuration.darkColor.color.toLowerCase();
  public readonly lightAlphaValueName: string = this.configuration.lightColor.alpha.toLowerCase();
  public readonly darkAlphaValueName: string = this.configuration.darkColor.alpha.toLowerCase();

  public readonly lightColor: SemanticColorsConfig.ParsedConfigurationValue = {
    name: this.name,
    value: this.lightColorName,
  };
  public readonly darkColor: SemanticColorsConfig.ParsedConfigurationValue = {
    name: this.name,
    value: this.darkColorName,
  };

  public readonly lightAlphaColor: SemanticColorsConfig.ParsedConfigurationValue = {
    name: this.name,
    value: this.lightAlphaValueName,
  };
  public readonly darkAlphaColor: SemanticColorsConfig.ParsedConfigurationValue = {
    name: this.name,
    value: this.darkAlphaValueName,
  };

  constructor(private readonly configuration: SemanticColorsConfig.Configuration, private readonly groupName: string) {}

  public getSemanticColorAsCssValue(): string {
    return `rgba(var(--semantic-color_${this.name}), var(--semantic-color-alpha_${this.name}))`;
  }
}
