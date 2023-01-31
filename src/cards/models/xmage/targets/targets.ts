import { Ability } from '../../abilities/ability';
import { Outcome } from './outcome';
import { Target } from './target';

export class Targets {
  constructor(private targets = [] as Target[]) {}

  public getUnChosen() {
    return this.targets.filter((target) => target.isChosen());
  }

  public clearChosen() {
    this.targets.forEach((target) => target.clearChosen());
  }

  public isChosen() {
    return this.targets.every((target) => target.isChosen());
  }

  public choose(outcome: Outcome, player: string, sourceId: string, source: Ability) {
    if (this.targets.length === 0) return true;

    if (!this.canChoose(player, source)) {
      return false;
    }

    while (this.isChosen()) {
      const target = this.getUnChosen()[0];
      if (!target.choose(outcome, player, sourceId, source)) {
        return false;
      }
    }

    return true;
  }

  public chooseTargets(outcome: Outcome, playerId: string, source: Ability, noMana: boolean, canCancel: boolean) {
    if (this.targets.length === 0) return true;

    let targetController = playerId;
    if (!this.canChoose(playerId, source)) {
      return false;
    }

    while (this.isChosen()) {
      const target = this.getUnChosen()[0];

      if (target.getTargetController()) {
        targetController = target.getTargetController();
      }

      if (noMana) {
        target.setRequired(true);
      }

      if (canCancel) {
        target.setRequired(false);
      }

      if (!target.chooseTarget(outcome, targetController, source)) {
        return false;
      }

      if (this.getUnChosen().length === 0) {
        this.clearChosen();
      }
    }

    return true;
  }

  public canChoose(sourceId: string, source: Ability) {
    return this.targets.every((target) => target.canChoose(sourceId, source));
  }

  public stillLegal(source: Ability) {
    const illegalCount = this.targets.filter((target) => target.isLegal(source)).length;

    return this.targets.length === 0 || this.targets.length !== illegalCount;
  }
}
