use std::path::PathBuf;

use dirs_next::document_dir;

pub fn cards_location() -> PathBuf {
    [document_dir().unwrap().to_str().unwrap(), "terrapin", "cards"].iter().collect()
}


pub fn database_location() -> PathBuf {
    [document_dir().unwrap().to_str().unwrap(), "terrapin", "database", "AllPrintings.sqlite"].iter().collect()
}

pub fn tokens_location() -> PathBuf {
    [document_dir().unwrap().to_str().unwrap(), "terrapin", "tokens"].iter().collect()
}