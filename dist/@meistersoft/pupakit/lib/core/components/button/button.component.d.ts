export declare type ButtonType = 'solid' | 'outlined' | 'link';
export declare type ButtonSize = 'large' | 'medium' | 'small';
export declare type ButtonColor = 'normal' | 'negative' | 'positive' | 'alert';
export declare class ButtonComponent {
    type: ButtonType;
    size: ButtonSize;
    color: ButtonColor;
    getResultClassList(prefix: string): string[];
}
