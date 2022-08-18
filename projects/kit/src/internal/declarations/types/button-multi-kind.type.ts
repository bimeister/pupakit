import { SemanticStatusKind } from '../types/semantic-status-kind.type';

export type ButtonMultiKind = Exclude<SemanticStatusKind, 'neutral'> | 'border';
