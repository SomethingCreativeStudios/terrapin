import { BaseCard } from '../base.card';
import { MoxOpalCard } from './mox-opal.card';
import { ThoughtcastCard } from './thoughtcast.card';

const cards = {
  'de2440de-e948-4811-903c-0bbe376ff64d': MoxOpalCard,
  'cce9bbff-82dc-4b2f-addd-d6715588de20': ThoughtcastCard,
} as Record<string, any>;

export { cards };
