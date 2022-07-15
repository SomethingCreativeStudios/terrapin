import { computed, reactive } from 'vue';
import { invoke } from '@tauri-apps/api/tauri';
import { Card, toCardColor, convertPips } from '~/models/card.model';

const state = reactive({ deck: [] as Card[] });

enum CardEventName {
  LOAD_DECK = 'load_deck',
}

// @ts-ignore
window.state.card = state;

async function loadDeck(deckName: string) {
  const foundDeck = await invoke<any[]>(CardEventName.LOAD_DECK, { deck_name: deckName });
  console.log(foundDeck);
  state.deck = foundDeck.map(item => toModel(item));
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
  };
}
