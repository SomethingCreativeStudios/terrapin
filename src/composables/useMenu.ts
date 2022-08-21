import { CardPosition } from '~/models/card.model';
import { ZoneType } from '~/models/zone.model';
import { useZone, useDeck } from '~/composables';

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
}

export function useMenu() {
  return { getMenu };
}

function buildExileMenu(position: CardPosition): MenuOptions {
  return {
    iconFontClass: 'iconfont',
    customClass: 'exile-menu',
    minWidth: 150,
    x: position.x,
    y: position.y,
    zIndex: 10000,
    items: [
      {
        label: 'View All',
        onClick: () => {
          const { drawXCards } = useDeck();
          drawXCards(7);
        },
      },
    ],
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
    items: [
      {
        label: 'View All',
        onClick: () => {
          const { drawXCards } = useDeck();
          drawXCards(7);
        },
      },
    ],
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
      {
        label: 'Draw 7',
        onClick: () => {
          const { drawXCards } = useDeck();
          drawXCards(7);
        },
      },
    ],
  };
}
