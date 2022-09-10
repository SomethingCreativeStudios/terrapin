import { Card } from "~/models/card.model";
import { Predicate } from "~/models/predicates.model";
import { cardNameFilter, NumberComparator } from "./common";


export class CardStatsFilter implements Predicate<Card> {

    constructor(private comparators: NumberComparator<'power' | 'toughness'>[]) { }

    apply(input: Card): boolean {
        return this.comparators.every(compare => compare.doesMeet(input))
    }
}

export class CardNameFilter implements Predicate<Card> {

    constructor(private query: string) { }

    apply(input: Card): boolean {
        const { name } = input;

        return name.toLowerCase().includes(this.query.toLowerCase()) || cardNameFilter(name.toLowerCase()).includes(this.query.toLowerCase());
    }
}