import { useGameItems } from '~/composables';
import { Card, CardColor } from '~/models/card.model';
import { Predicate } from '~/models/predicates.model';
import { ZoneType } from '~/models/zone.model';
import { cardNameFilter, NumberComparator } from './common';

export class CardStatsFilter implements Predicate<Card> {
  constructor(private comparators: NumberComparator<'power' | 'toughness'>[]) {}

  apply(input: Card): boolean {
    return this.comparators.every((compare) => compare.doesMeet(input));
  }
}

export class CardNameFilter implements Predicate<Card> {
  constructor(private query: string) {}

  apply(input: Card): boolean {
    const { name } = input;

    return name.toLowerCase().includes(this.query.toLowerCase()) || cardNameFilter(name.toLowerCase()).includes(this.query.toLowerCase());
  }
}

export class CardWhiteListZoneFilter implements Predicate<Card> {
  constructor(private allowedZones: ZoneType[]) {}

  apply(input: Card): boolean {
    const { getCardById } = useGameItems();
    const zone = getCardById(input.cardId).value?.zone;

    return this.allowedZones.some((allowed) => allowed === zone);
  }
}

export class CardBlackListZoneFilter implements Predicate<Card> {
  constructor(private noGoZones: ZoneType[]) {}

  apply(input: Card): boolean {
    const { getCardById } = useGameItems();
    const zone = getCardById(input.cardId).value?.zone;

    return !this.noGoZones.some((allowed) => allowed === zone);
  }
}

export class CardTypeFilter implements Predicate<Card> {
  constructor(private types: string[]) {}

  apply(input: Card): boolean {
    const { cardTypes, subTypes } = input;
    const allTypes = [...cardTypes, ...subTypes];

    return this.types.every((type) => allTypes.includes(type));
  }
}

export class CardManaColorFilter implements Predicate<Card> {
  constructor(private colors: CardColor[]) {}

  apply(input: Card): boolean {
    const { colors } = input;

    return this.colors.every((color) => colors.includes(color));
  }
}

export class CardColorIdentityFilter implements Predicate<Card> {
  constructor(private colors: CardColor[]) {}

  apply(input: Card): boolean {
    const { colorIdentity } = input;

    return this.colors.every((color) => colorIdentity.includes(color));
  }
}

export class CardTokenFilter implements Predicate<Card> {
  constructor() {}

  apply(input: Card): boolean {
    return input.isToken ?? false;
  }
}

export class CardCMCFilter implements Predicate<Card> {
  constructor(private comparator: NumberComparator<'convertedManaCost'>) {}

  apply(input: Card): boolean {
    return this.comparator.doesMeet(input);
  }
}

export class CardManaValueFilter implements Predicate<Card> {
  constructor(private comparator: NumberComparator<'manaValue'>) {}

  apply(input: Card): boolean {
    return this.comparator.doesMeet(input);
  }
}

export class CardHasXFilter implements Predicate<Card> {
  constructor() {}

  apply(input: Card): boolean {
    return input.manaCost.hasX;
  }
}
