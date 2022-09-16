import { Card, CardPosition } from '~/models/card.model';
import { ZoneType } from '~/models/zone.model';
import { useDeck, useDialog, useZone } from '~/composables';
import { startMulligan, castSpell } from '~/states';
import { HandActions, DeckActions, BattlefieldActions } from '~/actions';
import { NumberPromptDialogModel } from '~/models/dialog.model';

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

function getCardMenu(card: Card, position: CardPosition) {
  const { findZoneNameFromCard } = useZone();
  const zoneType = findZoneNameFromCard(card);

  if (zoneType === ZoneType.hand) {
    return buildCardHandMenu(card, position);
  }
}

export function useMenu() {
  return { getMenu, getCardMenu, buildMoveMenu };
}

function buildCardHandMenu(card: Card, position: CardPosition): MenuOptions {
  return {
    iconFontClass: 'iconfont',
    customClass: 'graveyard-menu',
    minWidth: 150,
    x: position.x,
    y: position.y,
    zIndex: 10000,
    items: [
      {
        label: card.cardTypes.includes('Land') ? 'Play' : 'Cast',
        onClick: async () => {
          castSpell(card);
        },
      },
    ],
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
        cards.map((card) => moveCard(fromZone, toZone as ZoneType, card));
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
      const { selectFrom } = useDialog();
      const cards = getCardsInZone(zone);
      selectFrom({ cards: cards.value, canMove: true, currentZone: zone, showShuffle: canShuffle });
    },
  };
}
