use serde::Serialize;

#[derive(Debug, Serialize, Clone)]
pub struct Card {
    pub id: i32,
    pub name: String,
    pub mana_cost: String,
    pub mana_value: i8,
    pub converted_mana_cost: i8,
    pub power: i8,
    pub card_types: String,
    pub sub_types: String,
    pub set_code: String,
    pub printings: String,
    pub layout: String,
    pub keywords: String,
    pub flavor_text: String,
    pub color_identity: String,
    pub colors: String,
    pub meta: CardMeta,
}

#[derive(Debug, Serialize, Clone)]
pub struct CardMeta {
    pub scryfall_id: String,
    pub scryfall_illustration_id: String,
    pub uuid: String,
}

#[derive(Debug, Serialize, Clone)]
pub struct CardDownload {
    pub event: DownloadEvent,
    pub card: Card,
    pub message: String,
}

#[derive(Debug, Serialize, Clone, PartialEq)]
pub enum DownloadEvent {
    SKIPPED,
    DOWNLOADED,
    FAILED,
}

pub fn event_name(event: &DownloadEvent) -> String {
    match event {
        DownloadEvent::DOWNLOADED => String::from("DOWNLOADED"),
        DownloadEvent::FAILED => String::from("FAILED"),
        DownloadEvent::SKIPPED => String::from("SKIPPED"),
    }
}
