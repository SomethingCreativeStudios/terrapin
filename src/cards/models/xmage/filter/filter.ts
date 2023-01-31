import { Predicate } from '~/models/predicates.model';

export enum Scope {
  ANY = 'any',
  ALL = 'all',
}

export abstract class Filter<T> {
  abstract match(o: T): boolean;
  abstract add(predicate: Predicate<T>): Filter<T>;
  abstract getPredicates(): Predicate<T>[];
}
