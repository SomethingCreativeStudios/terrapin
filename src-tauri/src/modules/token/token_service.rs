extern crate reqwest;

use std::fs;

use crate::modules::card::card_types::{Card, CardMeta};
use crate::modules::constants::{cards_location, tokens_location};
use crate::modules::download::download_service::DownloadService;
use crate::modules::token::token_types::TokenResponse;
use log::{error, info};

use super::token_types::TokenCardResponse;

pub struct TokenService {}

impl TokenService {
    pub fn download_tokens() {
        let cards = TokenService::download_token_data("https://api.scryfall.com/cards/search?order=cmc&q=%2B%2Bis%3Atoken");

        info!("{}", cards.len());
        std::fs::write(tokens_location().join("tokens.json"), serde_json::to_string_pretty(&cards).unwrap());

        DownloadService::download_cards(TokenService::map_tokens(cards));
    }

    pub fn get_tokens() -> Vec<Card> {
        info!("{}", tokens_location().join("tokens.json").to_str().ok_or("err").unwrap());
        fs::create_dir_all(tokens_location().to_str().unwrap()).unwrap_or_else(|_err| error!("Could not create dir for tokens"));

        let str_data = std::fs::read_to_string(tokens_location().join("tokens.json")).unwrap_or("[]".to_string());

        let token_cards: Vec<TokenCardResponse> = serde_json::from_str(str_data.as_str()).unwrap();

        TokenService::map_tokens(token_cards)
    }

    fn map_tokens(cards: Vec<TokenCardResponse>) -> Vec<Card> {
        let mut new_cards: Vec<Card> = Vec::new();

        for card in cards {
            new_cards.push(Card {
                id: 0,
                card_types: card.type_line,
                colors: card.colors.join(","),
                color_identity: card.color_identity.join(","),
                converted_mana_cost: 0.0,
                flavor_text: "".to_string(),
                keywords: card.keywords.join(","),
                layout: "".to_string(),
                mana_cost: "0".to_string(),
                mana_value: 0.0,
                name: card.name,
                power: card.power.parse().unwrap_or(0),
                toughness: card.toughness.parse().unwrap_or(0),
                printings: "".to_string(),
                set_code: "tokens".to_string(),
                sub_types: "".to_string(),
                meta: CardMeta {
                    is_token: true,
                    scryfall_id: card.id.clone(),
                    scryfall_illustration_id: card.id.clone(),
                    scryfall_oracle_id: card.id.clone(),
                    uuid: card.id.clone(),
                },
            })
        }

        new_cards
    }

    fn download_token_images(cards: Vec<TokenCardResponse>) {
        let download_path = cards_location().join("tokens");

        for card in cards {
            let resp = reqwest::blocking::get(card.image_uris.border_crop).unwrap();
            fs::create_dir_all(download_path.clone()).unwrap_or_else(|_err| error!("Could not create dir for card"));

            let mut file = std::fs::File::create(download_path.join(card.id + ".png")).unwrap();
        }
    }

    fn download_token_data(url: &str) -> Vec<TokenCardResponse> {
        let mut cards = Vec::new();
        let mut resp = reqwest::blocking::get(url).unwrap().json::<TokenResponse>().unwrap();
        let mut has_next_page = resp.has_more.clone();

        while has_next_page {
            cards.append(&mut resp.data);
            info!("Downloading Next Page {}", cards.len());
            resp = reqwest::blocking::get(resp.next_page).unwrap().json::<TokenResponse>().unwrap();
            has_next_page = resp.has_more.clone();
        }

        cards
    }
}
