export enum NumberComparison {
    LESS_THAN = 'less-than',
    GREATER_THAN = 'greater-than',
    LESS_THAN_OR_EQUAL_TO = 'less-than-or-equal-to',
    GREATER_THAN_OR_EQUAL_TO = 'greater-than-or-equal-to',
    EQUAL_TO = 'equal-to',
    NOT_EQUAL_TO = 'not-equal-to'
}

export class NumberComparator<T> {
    constructor(private fieldName: T, private compare: NumberComparison, private value: number) { }

    public doesMeet<U>(obj: U) {
        // @ts-ignore
        const value = obj[this.fieldName] as number;

        switch (this.compare) {
            case NumberComparison.EQUAL_TO:
                return value === this.value;
            case NumberComparison.LESS_THAN:
                return value < this.value;
            case NumberComparison.GREATER_THAN:
                return value > this.value;
            case NumberComparison.LESS_THAN_OR_EQUAL_TO:
                return value <= this.value;
            case NumberComparison.GREATER_THAN_OR_EQUAL_TO:
                return value >= this.value;
            case NumberComparison.NOT_EQUAL_TO:
                return value !== this.value;
            default:
                return false;
        }
    }
}

export function cardNameFilter(query: string) {
    return query.replaceAll(',', ' ').replaceAll('\'', '');
}