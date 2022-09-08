import { invoke } from "@tauri-apps/api";
import { v4 as uuidv4 } from 'uuid';
import { Card, convertPips, toCardColor } from "~/models/card.model";
import { TauriCommands } from "~/models/tauri.commands";

async function loadDeck(deckName: string): Promise<Card[]> {
    const cards = await invoke<any[]>(TauriCommands.LOAD_DECK, { deck_name: deckName });

    return cards.map((item: any) => toModel(item))
}

async function loadTokens() {
    const tokens = await invoke<Card[]>(TauriCommands.LOAD_TOKENS);
    return tokens.map((item: any) => toModel(item));
}


export function useTauri() {
    return { loadDeck, loadTokens }
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
        position: { x: 0, y: 30 },
    };
}
