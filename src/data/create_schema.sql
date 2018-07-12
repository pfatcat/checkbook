
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS payee_lookup;
DROP TABLE IF EXISTS payees;
DROP TABLE IF EXISTS categories;

PRAGMA foreign_keys = ON;

CREATE TABLE categories
(id UUID PRIMARY KEY,
 name VARCHAR(255) UNIQUE,
 inserted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--create default category record
INSERT INTO categories
(id, name)
SELECT 'f74a549c-3d46-4efd-95bb-935c642b649b', 'Uncategorized';

CREATE TABLE payees (
id TEXT PRIMARY KEY,
name TEXT UNIQUE,
default_category_id TEXT,
inserted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(default_category_id) REFERENCES categories(id)
);

CREATE TABLE payee_lookup (
id TEXT PRIMARY KEY,
payee_id TEXT,
reference_name TEXT UNIQUE, 
inserted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(payee_id) REFERENCES payees(id)
);

CREATE TABLE transactions (
id TEXT PRIMARY KEY,
transaction_date TEXT,
payee_id TEXT,
memo TEXT,
category_id TEXT,
amount REAL,
reference_code TEXT UNIQUE,
inserted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(payee_id) REFERENCES payees(id),
FOREIGN KEY(category_id) REFERENCES categories(id)
);

COMMIT;





