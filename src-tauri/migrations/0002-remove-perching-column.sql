BEGIN TRANSACTION;

ALTER TABLE jobs RENAME TO jobs_old;

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

INSERT INTO jobs (id, service_id, plate, created_at, car_type, price, is_uber, payment_type)
SELECT id, service_id, plate, created_at, car_type, price, is_uber, payment_type
FROM jobs_old;

DROP TABLE jobs_old;

COMMIT;
