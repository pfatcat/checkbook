import payee from "../services/payee.js"
import transaction_service from "../services/transaction.js"
import utilities from "../helpers/utilities.js"
import enums from "../helpers/enums.js"
import payee_service from "../services/payee.js"

function getElement(strTransaction, strElement) {
  strElement = "<" + strElement + ">"
  let element = strTransaction.substring(strTransaction.indexOf(strElement) + strElement.length)
  element = element.substring(0, element.indexOf("<") - 1) //remove carriage return
  return element
}

function parseTransaction(strTransaction) {

  const transaction_date = utilities.parseOFXDate(getElement(strTransaction, "DTPOSTED"))

  const transaction = {
    id: utilities.createGuid(),
    transaction_type: getElement(strTransaction, "TRNTYPE").trim(),
    transaction_date: transaction_date.trim(),
    amount: getElement(strTransaction, "TRNAMT").trim(),
    payee_name: getElement(strTransaction, "NAME").trim(),
  }

  const ofx_code = getElement(strTransaction, "REFNUM").trim()
  transaction.reference_code = ofx_code != "" ? ofx_code : utilities.buildReferenceCode(transaction)

  return transaction
}

function isValidTransaction(transaction) {

  if (transaction.reference_code == "") {
    return false
  }

  if (transaction.amount == "") {
    return false
  }

  if (transaction.payee_name == "") {
    return false
  }

  return true
}

const parseOFXfile = function (filename, callback) {
  const fs = require('fs');
  const path = require('path')
  const filepath = path.resolve(__dirname, filename)

  fs.readFile(filepath, 'utf-8', (err, data) => {
    if (err) {
      alert("An error ocurred reading the file :" + err.message);
      return;
    }

    const ofx = data.substring(data.indexOf("<OFX>"), data.length)
    const banktranlist = ofx.substring(ofx.indexOf("<BANKTRANLIST>"), ofx.indexOf("</BANKTRANLIST>") + 16)
    const str_transactions = banktranlist.substring(banktranlist.indexOf("<STMTTRN>"), banktranlist.length - 16)

    const ofx_transactions = str_transactions.split("<STMTTRN>");

    let promises = []

    for (let i = 0, len = ofx_transactions.length; i < len; i++) {

      let newTransaction = parseTransaction(ofx_transactions[i])

      if (isValidTransaction(newTransaction)) {
        const promise = new Promise(function (resolve, reject) {
          payee.findPayeeId(newTransaction.payee_name, function (payeeId) {
            newTransaction.payee_id = payeeId
            resolve(newTransaction)
          })
        });
        promises.push(promise)
      }
    }

    Promise.all(promises).then(function (transactions) {
      callback(transactions)
    })
  })
}

const saveOFXTransactions = function (ofxTransactions, payeeMap, callback) {

  let ofx_transaction_promises = []

  for (let i = 0; i < ofxTransactions.length; i++) {
    const transaction = ofxTransactions[i]
    transaction.payee_id = retrievePayeeId(transaction.payee_name, payeeMap)

    const promise = transaction_service.saveOFXTransactionPromise(transaction)
    ofx_transaction_promises.push(promise)
  }

  Promise.all(ofx_transaction_promises).then(callback())
}

module.exports = {
  parseOFXfile: parseOFXfile,
  saveOFXTransactions: saveOFXTransactions
}

function retrievePayeeId(sourcePayee, payeeMap) {

  const payeeId = payeeMap[sourcePayee]

  if (payeeId) {
    return payeeId
  }

  const new_payee_id = utilities.createGuid()
  const payee = { id: new_payee_id, name: sourcePayee, defaultCategoryId: enums.categories.uncategorized }
  payee_service.createPayee(payee, function (error) {
    if (error) { console.error(error) }
  })
  return new_payee_id
}

function checkExistingTransaction(ofxTransaction) {

  return false
}