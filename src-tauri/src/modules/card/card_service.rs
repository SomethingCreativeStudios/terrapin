extern crate glob;
extern crate reqwest;

use crate::modules::card::card_types::{Card, CardMeta};
use crate::modules::database::db::GLOBAL_CONNECTION;

use rusqlite::{Error, Row};
use serde::Serialize;
use std::collections::HashMap;
use std::fs;

#[derive(Debug)]
pub struct CountResult {
    pub count: i32,
}

#[derive(Debug, Serialize)]
pub struct ListCard {
    pub card_name: String,
    pub quantity: i8,
}

pub struct CardService {}

impl CardService {
    pub fn load_deck(deck_path: &str) -> Vec<Card> {
        let contents = fs::read_to_string(deck_path).expect("Something went wrong reading the file");

        let mut cards: Vec<ListCard> = Vec::new();

        for line_listing in contents.split("\n") {
            let mut parts: Vec<&str> = line_listing.split(" ").collect();
            let test = parts.remove(0).parse::<i8>().unwrap();

            cards.push(ListCard {
                card_name: parts.join(" ").replace("\r", ""),
                quantity: test,
            })
        }

        let card_map: HashMap<String, i8> = cards.iter().fold(HashMap::new(), |mut acc, item| {
            acc.insert(item.card_name.to_string(), item.quantity);
            acc
        });

        let card_names = cards.iter().map(|card| card.card_name.to_string()).collect();

        let found_cards = CardService::find_cards(card_names);

        found_cards.iter().fold(Vec::new(), |mut acc, item| {
            let quantity = match card_map.get(&item.name) {
                Some(quantity) => quantity.to_owned(),
                None => 0,
            };

            for _i in 0..quantity {
                acc.push(item.to_owned());
            }

            acc
        })
    }

    pub fn find_all_cards() -> Vec<Card> {
        let conn = GLOBAL_CONNECTION.lock().unwrap();
        let mut stmt = conn
            .prepare(format!("SELECT {} FROM cards", CardService::get_card_column()).as_str())
            .unwrap();

        let rows = stmt.query_map([], CardService::row_to_card).unwrap();

        let mut cards = Vec::new();

        for name_result in rows {
            cards.push(name_result.unwrap());
        }

        return cards;
    }

    pub fn find_cards(card_names: Vec<String>) -> Vec<Card> {
        let sql_part = card_names
            .iter()
            .map(|name| format!("'{}'", name.replace("'", "''").to_string()))
            .collect::<Vec<String>>()
            .join(",");

        let conn = GLOBAL_CONNECTION.lock().unwrap();
        let mut stmt = conn
            .prepare(
                format!(
                    "SELECT {} FROM cards WHERE name in ({}) GROUP BY name",
                    CardService::get_card_column(),
                    sql_part
                )
                .as_str(),
            )
            .unwrap();

        let rows = stmt.query_map([], CardService::row_to_card).unwrap();

        let mut cards = Vec::new();

        for name_result in rows {
            cards.push(name_result.unwrap());
        }

        return cards;
    }

    fn get_card_column() -> String {
        "id, name, manaCost, manaValue, convertedManaCost, power, toughness, types, subtypes, setCode , printings , layout , keywords , flavorText , colorIdentity ,colors ,scryfallId ,scryfallIllustrationId ,uuid, scryfallOracleId".to_string()
    }

    fn row_to_card(row: &Row) -> Result<Card, Error> {
        Ok(Card {
            id: row.get(0).unwrap(),
            name: row.get(1).unwrap(),
            mana_cost: row.get(2).unwrap_or("".to_string()),
            mana_value: row.get(3).unwrap_or(0.0),
            converted_mana_cost: row.get(4).unwrap_or(0.0),
            power: row.get::<usize, String>(5).unwrap_or(String::from("0")).parse().unwrap(),
            toughness: row.get::<usize, String>(6).unwrap_or(String::from("0")).parse().unwrap(),
            card_types: row.get(7).unwrap(),
            sub_types: row.get(8).unwrap_or("".to_string()),
            set_code: row.get(9).unwrap(),
            printings: row.get(10).unwrap(),
            layout: row.get(11).unwrap_or("".to_string()),
            keywords: row.get(12).unwrap_or("".to_string()),
            flavor_text: row.get(13).unwrap_or("".to_string()),
            color_identity: row.get(14).unwrap_or("".to_string()),
            colors: row.get(15).unwrap_or("".to_string()),
            meta: CardMeta {
                scryfall_id: row.get(16).unwrap_or("".to_string()),
                scryfall_illustration_id: row.get(17).unwrap_or("".to_string()),
                uuid: row.get(18).unwrap_or("".to_string()),
                scryfall_oracle_id:  row.get(19).unwrap_or("".to_string()),
                is_token: false,
            },
        })
    }
}
