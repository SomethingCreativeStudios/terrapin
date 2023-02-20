export abstract class Restriction {
  constructor() {}

  abstract isRestricted(cardId?: string): boolean;
}

export class CustomRestriction implements Restriction {
  constructor(private restriction: (cardId: string) => boolean) {}

  isRestricted(cardId?: string): boolean {
    return this.restriction(cardId || '');
  }
}
