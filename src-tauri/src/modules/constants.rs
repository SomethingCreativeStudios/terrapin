use std::path::PathBuf;

use dirs_next::document_dir;

pub fn cards_location() -> PathBuf {
    [document_dir().unwrap().to_str().unwrap(), "terrapin", "cards"].iter().collect()
}
