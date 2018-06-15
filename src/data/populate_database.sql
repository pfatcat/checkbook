
/*

SELECT t.id,
      p.name as payee,
      c.name as category,
      t.transaction_date as date,
      t.amount,
      t.memo
FROM transactions t
LEFT JOIN categories c
        ON t.category_id = c.id
LEFT JOIN payees p
        ON t.payee_id = p.id
ORDER BY t.transaction_date

SELECT id FROM categories WHERE name = 'Food'

INSERT INTO transactions (id, transaction_date, payee_id, memo, category_id, amount)
SELECT ?, ?, p.id, ?, ?, ?
FROM payee p
WHERE p.name = ?

*/
BEGIN;

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


INSERT INTO categories
(id, name)
SELECT 'f74a549c-3d46-4efd-95bb-935c642b649b', 'Uncategorized'
UNION SELECT '0a43815e-a6ae-46db-a667-fe9f4841fc23' , 'Food'
UNION SELECT '481b3272-1b3c-4640-8d35-8ef71589b0d0', 'Household'
UNION SELECT '76dcd927-e6cf-4336-974e-e7834a67eede', 'Credit Payment'
UNION SELECT 'ef64075e-d82a-4e74-be97-b2c26b7e2fff', 'Dining'
UNION SELECT '0847a273-97ba-4811-8529-f6d1552b54ae', 'Beer'
UNION SELECT '4cc76b1c-347c-481d-9ad8-4b66c0b18096', 'Travel'
UNION SELECT 'ad1f1a17-64d0-4ed0-bfc0-bd3e3c203377', 'Salary';


/*
SELECT * FROM categories
*/

CREATE TABLE payees (
id TEXT PRIMARY KEY,
name TEXT UNIQUE,
default_category_id TEXT,
inserted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(default_category_id) REFERENCES categories(id)
);

/*
SELECT * FROM payees
DELETE FROM payees
*/

INSERT INTO payees (id, name, default_category_id)
SELECT '05c34e74-81c3-4432-9570-02e6fa89fe5d', 'Sea Oats Motel', '4cc76b1c-347c-481d-9ad8-4b66c0b18096'
UNION SELECT '9fcc44e7-8cca-4f74-b4e1-d4e8fe828d04', 'Hattie B''s','ef64075e-d82a-4e74-be97-b2c26b7e2fff'
UNION SELECT '7691bcaa-29a4-4fdc-bdb5-99c67af6f3cf', 'Walgreens','481b3272-1b3c-4640-8d35-8ef71589b0d0'
UNION SELECT 'd686c493-ee13-4c18-9c54-a38ddbdb3bc0', 'Lowe''s', '481b3272-1b3c-4640-8d35-8ef71589b0d0'
UNION SELECT '3e6c3c1b-7aa3-4cd3-bc34-e3a39b7f1a4d', 'Forty AU', 'ad1f1a17-64d0-4ed0-bfc0-bd3e3c203377'
UNION SELECT '114416cb-9377-4df3-88bf-b1c6a10c5d8d', 'Food Lion', '0a43815e-a6ae-46db-a667-fe9f4841fc23'
UNION SELECT '05a9d83a-1975-4d81-b82c-6f00c7ca5fcb', 'Homegrown Taproom','0847a273-97ba-4811-8529-f6d1552b54ae'
UNION SELECT '88cbfd61-6fa9-450f-bd54-9dbfce9d8e22', 'Kroger',  '0a43815e-a6ae-46db-a667-fe9f4841fc23'
UNION SELECT 'a30a817c-dac8-4c64-ad29-3ef58013a652', 'Chase',  '76dcd927-e6cf-4336-974e-e7834a67eede'
UNION SELECT '9ae11b7f-dab6-4ba1-9f2c-ab2e63ccd4e8', 'Greek Cafe', 'ef64075e-d82a-4e74-be97-b2c26b7e2fff'
UNION SELECT 'f83884e8-43e0-4704-9eeb-570034f08a9d', 'Phat Bites', 'ef64075e-d82a-4e74-be97-b2c26b7e2fff'
UNION SELECT '2c0a41cc-cb70-4ad3-be35-62e1b8cfbd7e', 'CHECK', '76dcd927-e6cf-4336-974e-e7834a67eede';


CREATE TABLE payee_lookup (
id TEXT PRIMARY KEY,
payee_id TEXT,
reference_name TEXT UNIQUE, 
inserted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(payee_id) REFERENCES payees(id)
);

/*
SELECT * FROM payee_lookup
*/

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

/*
DELETE FROM transactions
*/

INSERT INTO transactions (id, payee_id, category_id, transaction_date, amount, memo)
SELECT '43037f0d-62ed-42a6-bd19-9b71cfa9ee47', p.id, c.id, '2018-04-14 00:00:00', -55.26, 'Good time' FROM categories c, payees p WHERE c.name = 'Travel' AND p.name = 'Sea Oats Motel'
UNION SELECT '51fc2e2f-9c05-439e-a4f0-299f65ac5f3b', p.id, c.id, '2018-06-24 00:00:00', -44.31, 'mmm' FROM categories c, payees p WHERE c.name = 'Dining' AND p.name = 'Hattie B''s'
UNION SELECT '55376897-8b0d-4c20-a447-29218d2acb75', p.id, c.id, '2018-03-17 00:00:00', -23.78, null FROM categories c, payees p WHERE c.name = 'Household' AND p.name = 'Walgreens'
UNION SELECT '13347b5e-7c10-4fac-87da-166b3e84faee', p.id, c.id, '2018-05-21 00:00:00', -89.25, null FROM categories c, payees p WHERE c.name = 'Household' AND p.name = 'Lowe''s'
UNION SELECT '96cc454f-b44d-4686-93ed-bcfb5dec1b22', p.id, c.id, '2018-06-01 00:00:00', 78.44, null FROM categories c, payees p WHERE c.name = 'Salary' AND p.name = 'Forty AU'
UNION SELECT '15480c28-5e3b-4a1c-83bd-430bf355290f', p.id, c.id, '2018-04-04 00:00:00', -27.33, 'not great' FROM categories c, payees p WHERE c.name = 'Food' AND p.name = 'Food Lion'
UNION SELECT 'ab0b8160-aaff-4d0a-9fe5-d1f902b3f82a', p.id, c.id, '2018-05-17 00:00:00', -102.33, 'nice hang' FROM categories c, payees p WHERE c.name = 'Beer' AND p.name = 'Homegrown Taproom'
UNION SELECT '7df8c5fa-a6d9-4d8f-b9b7-6635e866ca01', p.id, c.id, '2018-05-22 00:00:00', -23.66, null FROM categories c, payees p WHERE c.name = 'Food' AND p.name = 'Kroger'
UNION SELECT 'b54099ac-630a-4722-8699-2a68386ed6d5', p.id, c.id, '2018-04-22 00:00:00', -77.12, null FROM categories c, payees p WHERE c.name = 'Credit Payment' AND p.name = 'Chase'
UNION SELECT '40e36607-d745-4067-a0c2-3506a3eea8ee', p.id, c.id, '2018-03-16 00:00:00', -37.27, null FROM categories c, payees p WHERE c.name = 'Dining' AND p.name = 'Greek Cafe'
UNION SELECT '1e287e24-7c09-42de-88c3-d10583cffbad', p.id, c.id, '2018-05-08 00:00:00', -83.29, null FROM categories c, payees p WHERE c.name = 'Dining' AND p.name = 'Phat Bites';

COMMIT;
/*
SELECT *
FROM transactions
WHERE reference_code = '8155003935063'

SELECT *
FROM payees
WHERE name = 'Walgreens'

SELECT *
FROM payees p
WHERE p.name = 'CHECK'
*/





