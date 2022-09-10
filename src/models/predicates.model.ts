// Casually taking from XMage/Java :)

/**
 * Returns if input yields true or false
 */
export interface Predicate<T> {
    apply(input: T): boolean;
}

export function and<T>(predicates: Predicate<T>[]) {
    return new AndPredicate([...predicates]);
}

export function or<T>(predicates: Predicate<T>[]) {
    return new OrPredicate([...predicates]);
}

export class NotPredicate<T> implements Predicate<T>{
    constructor(private predicate: Predicate<T>) { }

    apply(input: T): boolean {
        return !this.predicate.apply(input);
    }

    toString(): string {
        return `Not(${this.predicate.toString()})`
    }

}

export class AndPredicate<T> implements Predicate<T>{
    constructor(private components: Predicate<T>[]) { }

    apply(input: T): boolean {
        return this.components.every(predicate => predicate.apply(input));
    }

    toString(): string {
        return `And(${this.components.toString()})`
    }
}

export class OrPredicate<T> implements Predicate<T>{
    constructor(private components: Predicate<T>[]) { }

    apply(input: T): boolean {
        return this.components.some(predicate => predicate.apply(input));
    }

    toString(): string {
        return `Or(${this.components.toString()})`
    }
}
