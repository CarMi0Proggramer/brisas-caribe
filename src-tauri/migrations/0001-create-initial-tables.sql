CREATE TABLE services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL
);

CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER NOT NULL,
    plate TEXT NOT NULL,
    price NUMERIC NOT NULL,
    car_type TEXT NOT NULL,
    is_uber BOOLEAN NOT NULL,
    payment_type TEXT NOT NULL,
    created_at DATE NOT NULL DEFAULT (DATE('now')),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

