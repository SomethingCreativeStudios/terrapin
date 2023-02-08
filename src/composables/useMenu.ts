import { Card, CardPosition, CardState } from '~/models/card.model';
import { ZoneType } from '~/models/zone.model';
import { useDeck, useDialog, useGameState, useZone } from '~/composables';
import { startMulligan, castSpell } from '~/states';
import { HandActions, DeckActions, BattlefieldActions } from '~/actions';
import { NumberPromptDialogModel } from '~/models/dialog.model';
import { BaseCard } from '~/cards/base.card';

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

function getMenu(zoneType: ZoneType, position: CardPosition) {
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

function getCardMenu(card: Card, state: CardState, position: CardPosition) {
  const { findZoneNameFromCard } = useZone();
  const zoneType = findZoneNameFromCard(card.cardId);

  return buildCardMenu(card, state, position, zoneType);
}

export function useMenu() {
  return { getMenu, getCardMenu, buildMoveMenu };
}

function buildCardMenu(card: Card, state: CardState, position: CardPosition, zone: ZoneType): MenuOptions {
  return {
    iconFontClass: 'iconfont',
    customClass: `${zone}-menu`,
    minWidth: 150,
    x: position.x,
    y: position.y,
    zIndex: 10000,
    items: [...getAllAbilities(state?.cardClass ?? null, zone), ...getAllCastingCost(card, state?.cardClass, zone)],
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
      const { getCardsInZone } = useZone();
      const { getMeta } = useGameState();
      const { selectFrom } = useDialog();
      const cardIds = getCardsInZone(zone);
      const cards = cardIds.value.map((id) => getMeta(id).value?.baseCard);

      selectFrom({ cards: cards, canMove: true, currentZone: zone, showShuffle: canShuffle });
    },
  };
}

function getAllAbilities(base: BaseCard | null, zone: ZoneType) {
  return (
    base?.abilities
      ?.map((ability) => ({
        validZones: ability.validZones,
        label: ability.text ?? 'Do Cost',
        customClass: ability.canDo() ? '' : 'disabled',
        onClick: () => ability.canDo() && ability.do(),
      }))
      ?.filter((cast) => cast.validZones.includes(zone)) ?? []
  );
}

function getAllCastingCost(card: Card, base: BaseCard | null, zone: ZoneType) {
  const mappedCosts =
    base?.castingCosts
      ?.map((cost) => ({
        validZones: cost.validZones,
        label: cost.label ?? 'Cast',
        customClass: cost.canCast() ? '' : 'disabled',
        onClick: () => cost.canCast() && cost.cast(),
      }))
      ?.filter((cast) => cast.validZones.includes(zone)) ?? [];

  const defaultCosts = [{ label: 'Card Info', customClass: '', onClick: () => console.log(card.oracleId, card.name) }];

  if (mappedCosts.length === 0) {
    const { canPlayLand } = useGameState();
    const isLand = card.cardTypes.includes('Land');

    return zone === ZoneType.hand
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

  return [...defaultCosts, ...mappedCosts];
}
