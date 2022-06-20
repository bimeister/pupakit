export namespace ColorsConfig {
  export interface Group {
    name: string;
    colors: Color[];
  }

  export interface Color {
    name: string;
    hex: string;
  }

  export interface AlphaValue {
    name: string;
    value: number;
  }
}
