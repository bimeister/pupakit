import { SemanticKind } from './semantic-kind.type';

export type TagKind = Omit<SemanticKind, 'neutral'> | 'custom';
