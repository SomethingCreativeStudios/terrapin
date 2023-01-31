import { BaseCard } from '../base.card';
import * as allCards from './cards';

//@ts-ignore
const cards = Object.entries(allCards).reduce((acc, [_, card]) => ({ ...acc, [card.UUID]: card }), {} as Record<string, BaseCard>) as Record<string, BaseCard>;

export { cards };
