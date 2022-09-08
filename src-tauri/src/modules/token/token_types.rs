use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct TokenResponse {
    pub has_more: bool,
    #[serde(default = "default_string")]
    pub next_page: String,
    pub total_cards: i32,
    pub data: Vec<TokenCardResponse>,
}

#[derive(Deserialize, Serialize)]
pub struct TokenCardResponse {
    pub id: String,
    pub name: String,
    #[serde(default = "default_uris")]
    pub image_uris: ScryImage,
    #[serde(default = "default_string")]
    pub mana_cost: String,
    #[serde(default = "default_string")]
    pub oracle_text: String,
    #[serde(default = "default_string")]
    pub type_line: String,
    #[serde(default = "default_string")]
    pub power: String,
    #[serde(default = "default_string")]
    pub toughness: String,
    #[serde(default = "default_array")]
    pub color_identity: Vec<String>,
    #[serde(default = "default_array")]
    pub colors: Vec<String>,
    #[serde(default = "default_array")]
    pub keywords: Vec<String>,
}

#[derive(Deserialize, Serialize)]
pub struct ScryImage {
    pub border_crop: String,
}

fn default_string() -> String {
    "0".to_string()
}

fn default_uris() -> ScryImage {
    {
        ScryImage { border_crop: "".to_string() }
    }
}

fn default_array() -> Vec<String> {
    Vec::new()
}
