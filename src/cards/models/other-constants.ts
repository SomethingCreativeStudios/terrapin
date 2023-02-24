export enum Outcome {
  DAMAGE = 'damage',
  DESTROY_PERMANENT = 'destroy permanent',
  UNBOOST_CREATURE = 'unboost creature',
  ADD_ABILITY = 'add ability',
  LOSE_ABILITY = 'lose ability',
  GAIN_LIFE = 'gain life',
  LOSE_LIFE = 'lose life',
  EXTRA_TURN = 'extra turn',
  BECOME_CREATURE = 'become creature',
  PUT_CREATURE_IN_PLAY = 'put creature in play',
  PUT_CARD_IN_PLAY = 'put card in play',
  PUT_LAND_IN_PLAY = 'put land in play',
  GAIN_CONTROL = 'gain control',
  DRAW_CARD = 'draw card',
  DISCARD = 'discard',
  SACRIFICE = 'Sacrifice',
  PLAY_FOR_FREE = 'play for free',
  RETURN_TO_HAND = 'return to hand',
  EXILE = 'exile',
  PROTECT = 'protect',
  PUT_MANA_IN_POOL = 'put mana in pool',
  REGENERATE = ' regenerate',
  PREVENT_DAMAGE = 'prevent damage',
  PREVENT_COST = 'prevent cost',
  REDIRECT_DAMAGE = 'redirect damage',
  TAP = 'tap',
  TRANSFORM = 'transform',
  UNTAP = 'untap',
  WIN = 'win',
  COPY = 'copy',
  BENEFIT = 'benefit',
  DETRIMENT = 'detriment',
  NEUTRAL = 'neutral',
  REMOVAL = 'removal',
  VOTE = 'vote',
}

export enum Duration {
  ONE_USE = 'one use',
  END_OF_GAME = 'end of game',
  WHILE_ON_BATTLE_FIELD = 'while on battlefield',
  WHILE_CONTROLLED = 'while controlled',
  WHILE_ON_STACK = 'while on stack',
  WHILE_IN_GRAVEYARD = 'while in graveyard',
  END_OF_TURN = 'end of turn',
  UNTIL_YOUR_NEXT_TURN = 'until your next turn',
  UNTIL_YOUR_NEXT_END_STEP = 'until your next end step',
  UNTIL_END_OF_YOUR_NEXT_TURN = ' until the end of your next turn',
  UNTIL_LEAVES_THE_BATTLEFIELD = 'until ~ leaves the battlefield',
  END_OF_COMBAT = 'end of combat',
  END_OF_STEP = 'end of step',
}

export enum DependencyType {
  AURA_ADDING_REMOVING,
  ARTIFICAT_ADDING_REMOVING,
  ADDING_ABILITY,
  ADDING_CREATURE_TYPE,
  BECOME_NON_BASIC_LAND,
  BECOME_FOREST,
  BECOME_ISLAND,
  BECOME_MOUNTAIN,
  BECOME_PLAINS,
  BECOME_SWAP,
  BECOME_CREATURE,
  ENCHANTMENT_ADDING_REMOVING,
  LOOSE_DEFENDER_EFFECT,
}

export enum Layer {
  CopyEffects_1,
  ControlChangingEffects_2,
  TextChangingEffects_3,
  TypeChangingEffects_4,
  ColorChangingEffects_5,
  AbilityAddingRemovingEffects_6,
  PTChangingEffects_7,
  PlayerEffects,
  RulesEffects,
}

export enum SubLayer {
  CopyEffects_1a,
  FaceDownEffects_1b,
  CharacteristicDefining_7a,
  SetPT_7b,
  ModifyPT_7c,
  Counters_7d,
  SwitchPT_e,
  NA,
}

export enum AsThoughEffectType {
  ATTACK,
  ATTACK_AS_HASTE,
  ACTIVATE_HASTE,
  //
  BLOCK_TAPPED,
  BLOCK_SHADOW,
  BLOCK_DRAGON,
  BLOCK_LANDWALK,
  BLOCK_PLAINSWALK,
  BLOCK_ISLANDWALK,
  BLOCK_SWAMPWALK,
  BLOCK_MOUNTAINWALK,
  BLOCK_FORESTWALK,
  //
  DAMAGE_NOT_BLOCKED,
  //
  // PLAY_FROM_NOT_OWN_HAND_ZONE + CAST_AS_INSTANT:
  // 1. Do not use dialogs in "applies" method for that type of effect (it calls multiple times and will freeze the game)
  // 2. All effects in "applies" must checks affectedControllerId/playerId.equals(source.getControllerId()) (if not then all players will be able to play it)
  // 3. Target must points to mainCard, but checking goes for every card's parts and characteristics from objectId (split, adventure)
  // 4. You must implement/override an applies method with "Ability affectedAbility" (e.g. check multiple play/cast abilities from all card's parts)
  // TODO: search all PLAY_FROM_NOT_OWN_HAND_ZONE and CAST_AS_INSTANT effects and add support of mainCard and objectId
  PLAY_FROM_NOT_OWN_HAND_ZONE,
  CAST_AS_INSTANT,
  //
  ACTIVATE_AS_INSTANT,
  //
  SHROUD,
  HEXPROOF,
  //
  PAY_0_ECHO,
  LOOK_AT_FACE_DOWN,
  //
  // SPEND_OTHER_MANA:
  // 1. It's uses for mana calcs at any zone, not stack only
  // 2. Compare zone change counter as "objectZCC <= targetZCC + 1"
  // 3. Compare zone with original (like exiled) and stack, not stack only
  // TODO: search all SPEND_ONLY_MANA effects and improve counters compare as SPEND_OTHER_MANA
  SPEND_OTHER_MANA,
  //
  SPEND_ONLY_MANA,
  //
  // ALLOW_FORETELL_ANYTIME:
  // For Cosmos Charger effect
  ALLOW_FORETELL_ANYTIME,
}
