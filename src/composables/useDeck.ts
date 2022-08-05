import { computed, reactive } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { curry } from 'ramda';
import { invoke } from '@tauri-apps/api/tauri';
import { useZone } from './useZone';
import { Card, convertPips, toCardColor } from '~/models/card.model';
import { ZoneType } from '~/models/zone.model';

const { addCardToZone } = useZone();
const state = reactive({ deck: [] as Card[] });

enum CardEventName {
  LOAD_DECK = 'load_deck',
}

// @ts-ignore
window.state.deck = state;

const shuffler = curry((random: any, list: any[]) => {
  let idx = -1;
  let position;
  let result = [] as any[];
  while (++idx < list.length) {
    position = Math.floor((idx + 1) * random());
    result[idx] = result[position];
    result[position] = list[idx];
  }
  return result;
});

const shuffle = shuffler(Math.random);

async function loadDeck(deckName: string) {
  const foundDeck = await invoke<any[]>(CardEventName.LOAD_DECK, { deck_name: deckName });

  state.deck = shuffle(foundDeck.map((item: any) => toModel(item))) as Card[];

  state.deck.forEach((card) => addCardToZone(ZoneType.deck, card));

  /** 
  const randomIntFromInterval = () => {
    const max = state.deck.length - 1;
    const min = 0;

    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  };


  addCardToZone('hand', state.deck[randomIntFromInterval()]);
  addCardToZone('hand', state.deck[randomIntFromInterval()]);
  addCardToZone('hand', state.deck[randomIntFromInterval()]);
  addCardToZone('hand', state.deck[randomIntFromInterval()]);
  addCardToZone('hand', state.deck[randomIntFromInterval()]);
  addCardToZone('hand', state.deck[randomIntFromInterval()]);
  addCardToZone('hand', state.deck[randomIntFromInterval()]);
  */
}

function getDeck() {
  return computed(() => state.deck);
}

export function useDeck() {
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
