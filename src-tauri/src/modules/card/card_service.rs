extern crate glob;
extern crate reqwest;

use self::glob::glob;
use crate::modules::card::card_types::{Card, CardDownload, CardMeta, DownloadEvent};
use crate::modules::constants::cards_location;
use crate::modules::database::db::GLOBAL_CONNECTION;

use log::info;
use rusqlite::{Error, Row};
use serde::Serialize;
use std::collections::HashMap;
use std::fs;
use std::hash::Hash;
use std::io::Cursor;
use std::sync::mpsc::Receiver;
use std::{
    path::Path,
    sync::{mpsc, Arc, Mutex},
    thread,
};

#[derive(Debug)]
pub struct CountResult {
    pub count: i32,
}

#[derive(Debug, Serialize)]
pub struct ListCard {
    pub cardName: String,
    pub quantity: i8,
}

#[derive(Debug)]
pub struct DownloadCollection {
    pub rx: Receiver<CardDownload>,
    pub expected_count: usize,
}

pub struct CardService {}

impl CardService {
    pub fn downloadImage(card: &Card) -> CardDownload {
        let resp = reqwest::blocking::get(format!(
            "https://api.scryfall.com/cards/{}?format=image&version=normal",
            card.meta.scryfall_id
        ))
        .unwrap();

        let cards_set_location = cards_location().join(card.set_code.clone());
        let card_location = cards_set_location.join(card.meta.scryfall_id.clone() + ".png");
        fs::create_dir_all(cards_set_location);

        let mut file = std::fs::File::create(card_location).unwrap();

        let mut content = Cursor::new(resp.bytes().unwrap());
        std::io::copy(&mut content, &mut file).unwrap();

        CardDownload {
            card: card.clone(),
            event: DownloadEvent::DOWNLOADED,
            message: String::from(""),
        }
    }

    pub fn download_all_cards() -> DownloadCollection {
        let files = glob(cards_location().join("**").join("*.png").to_str().unwrap()).unwrap();

        let mut skip_list: HashMap<String, String> = HashMap::new();

        for path in files.into_iter() {
            let part = path.as_ref().unwrap().file_name().unwrap().to_str().unwrap().to_string();
            skip_list.insert(part, "".to_string());
        }

        let cards = CardService::find_all_cards();

        CardService::parallel_download(20, &cards, &skip_list)
    }

    pub fn load_deck(deck_path: &str) -> Vec<Card> {
        let contents = fs::read_to_string(deck_path).expect("Something went wrong reading the file");

        let mut cards: Vec<ListCard> = Vec::new();

        for lineListing in contents.split("\n") {
            let mut parts: Vec<&str> = lineListing.split(" ").collect();
            let test = parts.remove(0).parse::<i8>().unwrap();

            cards.push(ListCard {
                cardName: parts.join(" ").replace("\r", ""),
                quantity: test,
            })
        }

        /* let card_names: Vec<String> = cards.iter().fold(Vec::new(), |mut acc, item| {
            for name in 0..item.quantity {
                acc.push(item.cardName.to_owned());
            }

            acc
        }); */

        let card_map: HashMap<String, i8> = cards.iter().fold(HashMap::new(), |mut acc, item| {
            acc.insert(item.cardName.to_string(), item.quantity);
            acc
        });

        let card_names = cards.iter().map(|card| card.cardName.to_string()).collect();

        let found_cards = CardService::find_cards(card_names);

        found_cards.iter().fold(Vec::new(), |mut acc, item| {
            let quantity = match card_map.get(&item.name) {
                Some(quantity) => quantity.to_owned(),
                None => 0,
            };

            for i in 0..quantity {
                acc.push(item.to_owned());
            }

            acc
        })
    }

    pub fn find_all_cards() -> Vec<Card> {
        let conn = GLOBAL_CONNECTION.lock().unwrap();
        let mut stmt = conn
            .prepare(format!("SELECT {} FROM cards", CardService::getCardColumns()).as_str())
            .unwrap();

        let rows = stmt.query_map([], CardService::row_to_card).unwrap();

        let mut cards = Vec::new();

        for name_result in rows {
            cards.push(name_result.unwrap());
        }

        return cards;
    }

    pub fn find_cards(cardNames: Vec<String>) -> Vec<Card> {
        let sqlPart = cardNames
            .iter()
            .map(|name| format!("'{}'", name.replace("'", "''").to_string()))
            .collect::<Vec<String>>()
            .join(",");

        info!(
            "{}",
            format!("SELECT {} FROM cards WHERE name in ({})", CardService::getCardColumns(), sqlPart)
        );
        let conn = GLOBAL_CONNECTION.lock().unwrap();
        let mut stmt = conn
            .prepare(
                format!(
                    "SELECT {} FROM cards WHERE name in ({}) GROUP BY name",
                    CardService::getCardColumns(),
                    sqlPart
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

    fn parallel_download(thread_count: usize, cards: &Vec<Card>, skip_list: &HashMap<String, String>) -> DownloadCollection {
        let (tx, rx) = mpsc::channel::<CardDownload>();
        let mut filtered_cards = Vec::new();

        info!("Skip List: {}", skip_list.contains_key("1bff641e-aad3-414f-ad5b-8d32c734efa9.png"));

        for card in cards.iter() {
            let card_file_name = String::from(card.meta.scryfall_id.clone()) + ".png";

            if skip_list.contains_key(&card_file_name) {
                tx.send(CardDownload {
                    event: DownloadEvent::SKIPPED,
                    card: card.clone(),
                    message: String::from(""),
                });
            } else {
                filtered_cards.push(card.clone());
            }
        }

        if filtered_cards.len() == 0 {
            info!("Already Up to date");
            return DownloadCollection { rx: rx, expected_count: 0 };
        }

        let card_count = filtered_cards.len().clone();
        let real_thread_count = if thread_count > filtered_cards.len() {
            filtered_cards.len()
        } else {
            thread_count
        };

        let chunk_size = (filtered_cards.len() as f32 / real_thread_count as f32) as usize;
        let mut chunks = Vec::new();

        for chunk in filtered_cards.chunks(chunk_size) {
            chunks.push(chunk.to_vec());
        }

        let chunk_size = chunks.len();
        let chunked_cards: Arc<std::sync::Mutex<Vec<Vec<Card>>>> = Arc::new(Mutex::new(chunks));

        for n in 0..chunk_size {
            let tx1 = tx.clone();
            let chunked_cards = Arc::clone(&chunked_cards);
            thread::spawn(move || {
                let runtime = tokio::runtime::Runtime::new().unwrap();
                let chunk = chunked_cards.lock().unwrap().get(n).unwrap().to_vec();

                for card in chunk.iter() {
                    let download_card = CardService::downloadImage(card);

                    tx1.send(download_card);
                }
            });
        }

        return DownloadCollection {
            rx: rx,
            expected_count: card_count,
        };
    }

    fn getCardColumns() -> String {
        return "id, name, manaCost, manaValue, convertedManaCost, power, types, subtypes, setCode , printings , layout , keywords , flavorText , colorIdentity ,colors ,scryfallId ,scryfallIllustrationId ,uuid".to_string();
    }

    fn row_to_card(row: &Row) -> Result<Card, Error> {
        return Ok(Card {
            id: row.get(0).unwrap(),
            name: row.get(1).unwrap(),
            mana_cost: row.get(2).unwrap_or("".to_string()),
            mana_value: row.get(3).unwrap_or(0),
            converted_mana_cost: row.get(4).unwrap_or(0),
            power: row.get(5).unwrap_or(0),
            card_types: row.get(6).unwrap(),
            sub_types: row.get(7).unwrap_or("".to_string()),
            set_code: row.get(8).unwrap(),
            printings: row.get(9).unwrap(),
            layout: row.get(10).unwrap_or("".to_string()),
            keywords: row.get(11).unwrap_or("".to_string()),
            flavor_text: row.get(12).unwrap_or("".to_string()),
            color_identity: row.get(13).unwrap_or("".to_string()),
            colors: row.get(14).unwrap_or("".to_string()),
            meta: CardMeta {
                scryfall_id: row.get(15).unwrap_or("".to_string()),
                scryfall_illustration_id: row.get(16).unwrap_or("".to_string()),
                uuid: row.get(17).unwrap_or("".to_string()),
            },
        });
    }
}
