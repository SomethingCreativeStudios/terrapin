import { computed, reactive } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { invoke } from '@tauri-apps/api/tauri';
import { useZone } from './useZone';
import { Card, toCardColor, convertPips } from '~/models/card.model';

const { addCardToZone } = useZone();
const state = reactive({ deck: [] as Card[] });

enum CardEventName {
  LOAD_DECK = 'load_deck',
}

// @ts-ignore
window.state.card = state;

async function loadDeck(deckName: string) {
  const foundDeck = await invoke<any[]>(CardEventName.LOAD_DECK, { deck_name: deckName });
  console.log(foundDeck);
  state.deck = foundDeck.map((item) => toModel(item));

  addCardToZone('hand', state.deck[0]);
  addCardToZone('hand', state.deck[1]);
  addCardToZone('hand', state.deck[2]);
  addCardToZone('hand', state.deck[3]);
  addCardToZone('hand', state.deck[4]);
  addCardToZone('hand', state.deck[5]);
  addCardToZone('hand', state.deck[6]);
}

function getDeck() {
  return computed(() => state.deck);
}

export function useCard() {
  return { loadDeck, getDeck };
}

function toModel(item: any): Card {
  return {
    name: item.name,
    manaCost: convertPips(item['mana_cost']),
    manaValue: item['mana_value'],
    convertedManaCost: item['converted_mana_cost'],
    power: item.power,
    toughness: item.toughness,
    cardTypes: item['card_types'].split(','),
    subTypes: item['sub_types'].split(','),
    setCode: item['set_code'],
    printings: item['printings'].split(','),
    layout: item['layout'],
    keywords: item['keywords'].split(','),
    flavorText: item.flavor_text,
    colorIdentity: item['color_identity'].split(',').map(toCardColor),
    colors: item.colors.split(',').map(toCardColor),
    imagePath: `https://card.${item.set_code}/${item.meta.scryfall_id}.png`,
    cardId: uuidv4(),
  };
}
