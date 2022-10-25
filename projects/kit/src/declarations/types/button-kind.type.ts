import { SemanticKind } from './semantic-kind.type';

export type ButtonKind = Exclude<SemanticKind, 'neutral' | 'opacity'> | 'secondary' | 'border';
