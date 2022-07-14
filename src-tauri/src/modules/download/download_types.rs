use std::sync::mpsc::Receiver;

use serde::Serialize;

use crate::modules::card::card_types::Card;

#[derive(Debug)]
pub struct DownloadCollection {
    pub rx: Receiver<CardDownload>,
    pub expected_count: usize,
}

#[derive(Debug, Serialize, Clone)]
pub struct CardDownload {
    pub event: DownloadEvent,
    pub card: Card,
    pub message: String,
}

#[derive(Debug, Serialize, PartialEq, Clone)]
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
