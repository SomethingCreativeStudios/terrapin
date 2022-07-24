use crate::modules::constants::database_location;
use once_cell::sync::Lazy;
use rusqlite::Connection;
use std::sync::Mutex;

pub static GLOBAL_CONNECTION: Lazy<Mutex<Connection>> = Lazy::new(|| Mutex::new(Connection::open(database_location()).unwrap()));
