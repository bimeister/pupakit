import { SemanticStatusKind } from '../types/semantic-status-kind.type';

export type ButtonKind = Exclude<SemanticStatusKind, 'neutral'> | 'secondary' | 'border';
