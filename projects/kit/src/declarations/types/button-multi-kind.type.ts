import { SemanticKind } from '../types/semantic-kind.type';

export type ButtonMultiKind = Exclude<SemanticKind, 'neutral' | 'opacity'> | 'border';
