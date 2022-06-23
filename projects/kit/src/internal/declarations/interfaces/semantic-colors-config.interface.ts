export namespace SemanticColorsConfig {
  export interface Group {
    name: string;
    configurations: Configuration[];
  }

  export interface Configuration {
    name: string;
    lightColor: SemanticColor;
    darkColor: SemanticColor;
  }

  export interface SemanticColor {
    color: string;
    alpha: string;
  }

  export interface ParsedConfigurationValue {
    name: string;
    value: string;
  }
}
