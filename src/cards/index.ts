import { BaseCard } from './models/base.card';
import * as allCards from './all';

//@ts-ignore
const cards = Object.entries(allCards).reduce((acc, [_, card]) => ({ ...acc, [card.UUID]: card }), {} as Record<string, BaseCard>) as Record<string, BaseCard>;

export { cards };
