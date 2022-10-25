export interface TreeNodeProperties {
  level?: number;
  isDirectory?: boolean;
  isLoading?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
  isDisabled?: boolean;
  expand?: () => void;
}
