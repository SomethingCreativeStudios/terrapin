use once_cell::sync::Lazy;
use rusqlite::Connection;
use std::sync::Mutex;

pub static GLOBAL_CONNECTION: Lazy<Mutex<Connection>> = Lazy::new(|| {
    Mutex::new(
        Connection::open(r#"C:\Users\Eric\Documents\AllPrintings.sqlite\AllPrintings.sqlite"#)
            .unwrap(),
    )
});
