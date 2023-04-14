export interface TreeNodeProperties {
  level?: number;
  isDirectory?: boolean;
  isLoading?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
  isDisabled?: boolean;
  forceHover?: boolean;
  expand?: () => void;
}
