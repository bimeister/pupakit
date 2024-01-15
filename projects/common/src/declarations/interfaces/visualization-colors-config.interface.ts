export namespace VisualizationColorsConfig {
  export interface Group {
    name: string;
    configurations: Configuration[];
  }

  export interface Configuration {
    name: string;
    lightColor: string;
    darkColor: string;
  }

  export interface ParsedConfigurationValue {
    name: string;
    value: string;
  }
}
