import { AtomSize } from '../types/atom-size.type';

export type ButtonSize = Exclude<AtomSize, 'xxl' | 'xxs'>;
