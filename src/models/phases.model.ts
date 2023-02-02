export enum TurnPhase {
  UPTAP = 'untap',
  UPKEEP = 'upkeep',
  DRAW = 'draw',
  MAIN_ONE = 'main phase',
  COMBAT = 'combat',
  DECLARE_ATTACKERS = 'declare attackers',
  DECLARE_BLOCKERS = 'declare blockers',
  SPECIAL_DAMAGE = 'special damage',
  DAMAGE = 'damage',
  END_COMBAT = 'end combat',
  MAIN_TWO = 'main phase two',
  END_TURN = 'end turn',
  CLEAN_UP = 'clean up',
  NOTHING = 'nothing',
}

export enum PhaseType {
  START = 'start',
  END = 'end',
}
