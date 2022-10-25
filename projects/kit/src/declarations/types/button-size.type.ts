import { AtomSize } from '@bimeister/pupakit.common';

export type ButtonSize = Exclude<AtomSize, 'xxl' | 'xxs'>;
