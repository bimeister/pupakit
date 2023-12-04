import { SemanticKind } from './semantic-kind.type';

export type HighlightKind = Exclude<SemanticKind, 'opacity'>;
