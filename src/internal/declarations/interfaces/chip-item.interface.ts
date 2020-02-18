export interface ChipItem {
  key: string;
  value: string;
  icon: string;
  clickable?: boolean;
  children?: ChipItem[];
}
