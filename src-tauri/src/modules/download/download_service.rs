extern crate glob;
extern crate reqwest;

use log::{error, info};

use self::glob::glob;

use crate::modules::card::card_service::CardService;
use crate::modules::card::card_types::Card;
use crate::modules::constants::cards_location;

use super::download_types::{CardDownload, DownloadCollection, DownloadEvent};

use std::collections::HashMap;
use std::io::Cursor;
use std::sync::mpsc::{self, Sender};
use std::sync::{Arc, Mutex};
use std::{fs, thread};

pub struct DownloadService {}

impl DownloadService {
    pub fn download_all_cards() -> DownloadCollection {
        let files = glob(cards_location().join("**").join("*.png").to_str().unwrap()).unwrap();

        let mut skip_list: HashMap<String, String> = HashMap::new();

        for path in files.into_iter() {
            let part = path.as_ref().unwrap().file_name().unwrap().to_str().unwrap().to_string();
            skip_list.insert(part, "".to_string());
        }

        let cards = CardService::find_all_cards();

        DownloadService::parallel_download(20, &cards, &skip_list)
    }

    pub fn download_image(card: &Card) -> CardDownload {
        let resp = reqwest::blocking::get(format!(
            "https://api.scryfall.com/cards/{}?format=image&version=normal",
            card.meta.scryfall_id
        ))
        .unwrap();

        let cards_set_location = cards_location().join(card.set_code.clone());
        let card_location = cards_set_location.join(card.meta.scryfall_id.clone() + ".png");
        fs::create_dir_all(cards_set_location)
            .unwrap_or_else(|_err| error!("Could not create dir for card, {}", card_location.clone().to_str().unwrap()));

        let mut file = std::fs::File::create(card_location).unwrap();

        let mut content = Cursor::new(resp.bytes().unwrap());
        std::io::copy(&mut content, &mut file).unwrap();

        CardDownload {
            card: card.clone(),
            event: DownloadEvent::DOWNLOADED,
            message: String::from(""),
        }
    }

    fn parallel_download(thread_count: usize, cards: &Vec<Card>, skip_list: &HashMap<String, String>) -> DownloadCollection {
        let (tx, rx) = mpsc::channel::<CardDownload>();
        let mut filtered_cards = DownloadService::filter_cards(cards, skip_list, &tx);

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
                let chunk = chunked_cards.lock().unwrap().get(n).unwrap().to_vec();

                for card in chunk.iter() {
                    let download_card = DownloadService::download_image(card);

                    tx1.send(download_card).unwrap_or_else(|_err| info!("Could not send event"));
                }
            });
        }

        return DownloadCollection {
            rx: rx,
            expected_count: card_count,
        };
    }

    fn filter_cards(cards: &Vec<Card>, skip_list: &HashMap<String, String>, tx: &Sender<CardDownload>) -> Vec<Card> {
        let mut filtered_cards = Vec::new();

        for card in cards.iter() {
            let card_file_name = String::from(card.meta.scryfall_id.clone()) + ".png";

            if skip_list.contains_key(&card_file_name) {
                tx.send(CardDownload {
                    event: DownloadEvent::SKIPPED,
                    card: card.clone(),
                    message: String::from(""),
                })
                .unwrap_or_else(|_err| info!("Could not send event"));
            } else {
                filtered_cards.push(card.clone());
            }
        }

        filtered_cards
    }
}
