#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

mod modules;

use std::fs::{canonicalize, read};

use log::{error, info};
use modules::{
    card::{card_service::CardService, card_types::Card},
    constants::cards_location,
    download::{download_service::DownloadService, download_types::event_name},
    token::token_service::TokenService,
};
use simple_logger::SimpleLogger;
use tauri::{http::ResponseBuilder, CustomMenuItem, Menu, Submenu, Window};

pub struct DBState {}

fn main() {
    SimpleLogger::new().with_level(log::LevelFilter::Info).init().unwrap();
    let context = tauri::generate_context!();

    let download_tokens = CustomMenuItem::new("download-tokens".to_string(), "Download Tokens");
    let download_cards = CustomMenuItem::new("download-cards".to_string(), "Download Cards");
    let submenu_download = Submenu::new("Update", Menu::new().add_item(download_tokens).add_item(download_cards));

    let menu = Menu::new().add_submenu(submenu_download);

    tauri::Builder::default()
        .menu(tauri::Menu::os_default(&context.package_info().name))
        .invoke_handler(tauri::generate_handler![load_deck, update_cards, load_card, load_tokens])
        .register_uri_scheme_protocol("card", move |_app, request| {
            let uri = request.uri().replace("card://", "");
            let path = cards_location().join(uri.as_str());
            let content = read(canonicalize(path.to_str().unwrap())?)?;
            let (data, meta) = (content, "image/png");
            ResponseBuilder::new().mimetype(meta).body(data)
        })
        .menu(menu)
        .on_menu_event(|event| match event.menu_item_id() {
            "download-tokens" => {
                TokenService::download_tokens();
            }
            _ => info!("Something else"),
        })
        .run(context)
        .expect("error while running tauri application");
}

#[tauri::command]
fn load_deck() -> Vec<Card> {
    CardService::load_deck(r#".\test-decks\8cast.txt"#)
}

#[tauri::command]
fn load_tokens() -> Vec<Card> {
    TokenService::get_tokens()
}

#[tauri::command]
fn load_card(card_names: Vec<String>) -> Vec<Card> {
    CardService::find_cards(card_names)
}

#[tauri::command]
async fn update_cards(window: Window) {
    fn download_event(name: &str) -> String {
        format!("update-cards__{}", name)
    }

    let collection = DownloadService::download_all_cards();

    for card in collection.rx {
        if event_name(&card.event).eq("DOWNLOADED") {
            window
                .emit(download_event("action").as_str(), card)
                .unwrap_or_else(|err| error!("error occurred: {}", err));
        }
    }

    info!("Done With Everything? {}", collection.expected_count);
}
