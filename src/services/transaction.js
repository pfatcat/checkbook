import repo from "../data/repo";

const getTransactions = function (render_callback) {

  const sql = `SELECT t.id,
                      p.name as payee_name,
                      c.name as category_name,
                      t.transaction_date,
                      t.amount,
                      t.memo
                FROM transactions t
                LEFT JOIN categories c
                        ON IFNULL(t.category_id, 'f74a549c-3d46-4efd-95bb-935c642b649b') = c.id
                LEFT JOIN payees p
                        ON t.payee_id = p.id
                ORDER BY t.transaction_date`;

  const params = []

  repo.getData(sql, params, function (data) {
    render_callback(data)
  });
}

const saveTransaction = function (newTransaction, callback) {
  const sql = `INSERT INTO transactions (id, transaction_date, payee_id, memo, category_id, amount,reference_code)
                  VALUES (?, ?, ?, ?, ?, ?, ?);`
  const params = [newTransaction.id, newTransaction.transaction_date, newTransaction.payee_id, newTransaction.memo, newTransaction.category_id, newTransaction.amount, newTransaction.reference_code]

  repo.executeStatement(sql, params, function (error) {
    callback(error);
  });
}


const saveOFXTransaction = function (newTransaction, callback) {
  const sql = `INSERT INTO transactions (id, transaction_date, payee_id, memo, category_id, amount, reference_code)
                  SELECT ?, ?, ?, ?, p.default_category_id, ?, ?
                  FROM payees p
                  WHERE p.id = ?
                  AND NOT EXISTS (SELECT 1 FROM transactions WHERE reference_code = ?);`

  const params = [newTransaction.id,
  newTransaction.transaction_date,
  newTransaction.payee_id,
  newTransaction.memo,
  newTransaction.amount,
  newTransaction.reference_code,
  newTransaction.payee_id,
  newTransaction.reference_code]

  repo.executeStatement(sql, params, function (error) {
    callback(error);
  });
}

const saveQIFTransaction = function (newTransaction, callback) {
  const sql = `INSERT INTO transactions (id, transaction_date, payee_id, memo, category_id, amount, reference_code)
               SELECT ?, ?, ?, ?, ?, ?, ?
               WHERE NOT EXISTS (SELECT 1 FROM transactions WHERE reference_code = ?);`
  const params = [newTransaction.id, newTransaction.transaction_date, newTransaction.payee_id, newTransaction.memo, newTransaction.category_id, newTransaction.amount, newTransaction.reference_code, newTransaction.reference_code]

  repo.executeStatement(sql, params, function (error) {
    callback(error);
  });
}

const saveOFXTransactionPromise = function (transaction) {

  return new Promise(function (resolve, reject) {
    saveOFXTransaction(transaction, function (error) {
      if (error) {
        reject(error)
        return
      }
      resolve(transaction)
    })
  });
}

const saveQIFTransactionPromise = function (transaction) {
  return new Promise(function (resolve, reject) {
    saveQIFTransaction(transaction, function (error) {
      if (error) {
        reject(error)
        return
      }
      resolve()
    })
  });

}

const getTransactionByReferenceCode = function (reference_code, callback) {

  const sql = `SELECT * FROM transactions WHERE reference_code = ?`

  const params = [reference_code]

  repo.getRow(sql, params, function (payee, error) {
    callback(payee, error)
  })
}

module.exports = {
  getTransactions: getTransactions,
  getTransactionByReferenceCode: getTransactionByReferenceCode,
  saveTransaction: saveTransaction,
  saveOFXTransaction: saveOFXTransaction,
  saveQIFTransaction: saveQIFTransaction,
  saveOFXTransactionPromise: saveOFXTransactionPromise,
  saveQIFTransactionPromise: saveQIFTransactionPromise
}

/**** PRIVATE FUNCTIONS ****/
