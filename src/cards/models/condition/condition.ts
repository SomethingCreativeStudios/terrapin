import { Ability } from '../abilities/ability';

export abstract class Condition {
  public abstract meets(source: Ability): Promise<boolean>;

  public static createEmpty() {
    return new EmptyCondidtion();
  }
}

export class AndCondidtion implements Condition {
  constructor(private conditions: Condition[], private text: string) {}

  public async meets(source: Ability): Promise<boolean> {
    for await (const con of this.conditions) {
      const doesMeet = await con.meets(source);
      if (!doesMeet) {
        return false;
      }
    }

    return true;
  }

  public toString() {
    return this.text;
  }
}

export class OrCondidtion implements Condition {
  constructor(private conditions: Condition[], private text: string) {}

  public async meets(source: Ability): Promise<boolean> {
    for await (const con of this.conditions) {
      const doesMeet = await con.meets(source);
      if (doesMeet) {
        return true;
      }
    }

    return false;
  }

  public toString() {
    return this.text;
  }
}

export class EmptyCondidtion implements Condition {
  public async meets(source: Ability): Promise<boolean> {
    return true;
  }
}
