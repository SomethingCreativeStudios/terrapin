import { Card, CardPosition, CardState } from '~/models/card.model';
import { ZoneType } from '~/models/zone.model';
import { useDeck, useDialog, useGameItems, useGameTracker, useZone } from '~/composables';
import { startMulligan, castSpell } from '~/states';
import { HandActions, DeckActions, BattlefieldActions } from '~/actions';
import { NumberPromptDialogModel } from '~/models/dialog.model';
import { BaseCard } from '~/cards/models/base.card';
import { AbilityType } from '~/cards/models/abilities/ability';
import { AsThoughEffectType } from '~/cards/models/other-constants';

interface MenuOptions {
  items: MenuOption[];
  iconFontClass: string;
  customClass: string;
  minWidth: number;
  zIndex: number;
  x: number;
  y: number;
}

interface MenuOption {
  label: string;
  onClick: () => void;
  icon?: string;
  divided?: boolean;
  customClass?: string;
  minWidth?: number;
  maxWidth?: number;
  disabled?: boolean;
  children?: MenuOption[];
}

async function getMenu(zoneType: ZoneType, position: CardPosition) {
  if (zoneType === ZoneType.deck) {
    return buildDeckMenu(position);
  }

  if (zoneType === ZoneType.graveyard) {
    return buildGraveyardMenu(position);
  }

  if (zoneType === ZoneType.exile) {
    return buildExileMenu(position);
  }

  if (zoneType === ZoneType.battlefield) {
    return buildBattlefieldMenu(position);
  }

  if (zoneType === ZoneType.hand) {
    return buildHandMenu(position);
  }
}

async function getCardMenu(card: Card, state: CardState, position: CardPosition) {
  const { findZoneNameFromCard } = useZone();
  const zoneType = findZoneNameFromCard(card.cardId);

  return buildCardMenu(card, state, position, zoneType);
}

export function useMenu() {
  return { getMenu, getCardMenu, buildMoveMenu };
}

async function buildCardMenu(card: Card, state: CardState, position: CardPosition, zone: ZoneType): Promise<MenuOptions> {
  const abilityItems = await getAllAbilities(state?.cardClass ?? null, zone);

  return {
    iconFontClass: 'iconfont',
    customClass: `${zone}-menu`,
    minWidth: 150,
    x: position.x,
    y: position.y,
    zIndex: 10000,
    items: [...abilityItems, ...getAllCastingCost(card, state?.cardClass, zone)],
  };
}

// Build generic move dialog (ignore current zone)
function buildMoveMenu(fromZone: ZoneType, position: CardPosition, cards: Card[] = [], onSelected?: (toZone: ZoneType) => void) {
  const { moveCard } = useZone();

  const items = Object.keys(ZoneType).reduce((acc, zone) => {
    const toZone = ZoneType[zone as keyof typeof ZoneType];
    if (toZone === fromZone) return acc;

    return acc.concat({
      label: `Move to ${toZone}`,
      onClick: () => {
        cards.map((card) => moveCard(fromZone, toZone as ZoneType, card.cardId));
        onSelected?.(toZone);
      },
    });
  }, [] as MenuOption[]);

  return {
    iconFontClass: 'iconfont',
    customClass: 'move-menu',
    minWidth: 150,
    x: position.x,
    y: position.y,
    zIndex: 10000,
    items,
  };
}

function buildBattlefieldMenu(position: CardPosition): MenuOptions {
  return {
    iconFontClass: 'iconfont',
    customClass: 'hand-menu',
    minWidth: 150,
    x: position.x,
    y: position.y,
    zIndex: 10000,
    items: [
      {
        label: 'Untap All',
        onClick: async () => {
          BattlefieldActions.untapAll();
        },
      },
    ],
  };
}

function buildHandMenu(position: CardPosition): MenuOptions {
  return {
    iconFontClass: 'iconfont',
    customClass: 'hand-menu',
    minWidth: 150,
    x: position.x,
    y: position.y,
    zIndex: 10000,
    items: [
      {
        label: 'Mulligan',
        onClick: async () => {
          startMulligan();
        },
      },
      {
        label: 'Randomly Discard',
        onClick: async () => {
          HandActions.randomlyDiscard();
        },
      },
    ],
  };
}

function buildExileMenu(position: CardPosition): MenuOptions {
  return {
    iconFontClass: 'iconfont',
    customClass: 'exile-menu',
    minWidth: 150,
    x: position.x,
    y: position.y,
    zIndex: 10000,
    items: [viewAll(ZoneType.exile)],
  };
}

function buildGraveyardMenu(position: CardPosition): MenuOptions {
  return {
    iconFontClass: 'iconfont',
    customClass: 'graveyard-menu',
    minWidth: 150,
    x: position.x,
    y: position.y,
    zIndex: 10000,
    items: [viewAll(ZoneType.graveyard)],
  };
}

function buildDeckMenu(position: CardPosition): MenuOptions {
  return {
    iconFontClass: 'iconfont',
    customClass: 'deck-menu',
    minWidth: 150,
    x: position.x,
    y: position.y,
    zIndex: 10000,
    items: [
      viewAll(ZoneType.deck, true),
      {
        label: 'Shuffle',
        onClick: () => {
          DeckActions.shuffleDeck();
        },
      },
      {
        label: 'Draw 7',
        onClick: () => {
          const { drawXCards } = useDeck();
          drawXCards(7);
        },
      },
      {
        label: 'Mill Top',
        onClick: () => {
          const { millXCards } = DeckActions;
          millXCards(1);
        },
      },
      {
        label: 'Mill X',
        onClick: async () => {
          const { millXCards } = DeckActions;
          const { promptUser } = useDialog();

          const response = await promptUser({ question: 'How Many Do You Want To Mill?', responseType: 'Number' } as NumberPromptDialogModel);
          if (response) {
            millXCards(Number(response));
          }
        },
      },
    ],
  };
}

function viewAll(zone: ZoneType, canShuffle = false) {
  return {
    label: 'View All',
    onClick: () => {
      const { selectFrom } = useDialog();

      selectFrom({ zone, canMove: true, currentZone: zone, showShuffle: canShuffle, dialogGroup: zone });
    },
  };
}

async function getAllAbilities(base: BaseCard | null, zone: ZoneType) {
  const menuItems = [];
  for await (const ability of base?.abilities ?? []) {
    const canDo = await ability.canDo();

    menuItems.push({
      validZones: ability.validZones,
      abilityType: ability.type,
      label: ability.label ?? 'Do Cost',
      customClass: canDo ? '' : 'disabled',
      onClick: () => canDo && ability.do(),
    });
  }

  return (
    menuItems.filter((cast) => {
      return cast.validZones.includes(zone) && (cast.abilityType === AbilityType.LOYALTY || cast.abilityType === AbilityType.ACTIVATED);
    }) ?? []
  );
}

function getAllCastingCost(card: Card, base: BaseCard | null, zone: ZoneType) {
  const defaultCosts = [
    { label: 'Card Info', customClass: '', onClick: () => console.log(card.oracleId, card.name.toLowerCase().replaceAll(' ', '-'), card.name.replaceAll(' ', '')) },
  ];

  const { canPlayLand } = useGameTracker();
  const isLand = card.cardTypes.includes('Land');

  const isInHand = () => {
    const { getAllAsThoughEffects } = useGameItems();
    if (zone === ZoneType.hand) {
      return true;
    }

    const effectsRelated = (getAllAsThoughEffects().value ?? []).filter((effect) => effect.target === card.cardId);

    return effectsRelated.some((effect) => effect.asThoughType === AsThoughEffectType.PLAY_FROM_NOT_OWN_HAND_ZONE);
  };

  return isInHand()
    ? defaultCosts.concat([
        {
          label: isLand ? 'Play' : 'Cast',
          customClass: isLand && !canPlayLand().value ? 'disabled' : '',
          onClick: async () => {
            if ((isLand && canPlayLand().value) || !isLand) {
              castSpell(card);
            }
          },
        },
      ])
    : defaultCosts;
}
