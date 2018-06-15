import payee from "../services/payee.js"
import transaction_service from "../services/transaction.js"
import utilities from "../helpers/utilities.js"

function getElement(strTransaction, strElement){
  strElement = "<" + strElement + ">"
  let element = strTransaction.substring(strTransaction.indexOf(strElement) + strElement.length)
  element = element.substring(0, element.indexOf("<") - 1) //remove carriage return
  return element
}

function parseTransaction(strTransaction){

  const transaction_date = utilities.parseOFXDate(getElement(strTransaction, "DTPOSTED"))

  const transaction = {
    transaction_type: getElement(strTransaction, "TRNTYPE").trim(),
    transaction_date: transaction_date.trim(),
    amount: getElement(strTransaction, "TRNAMT").trim(),
    payee: getElement(strTransaction, "NAME").trim(),
    reference_code: getElement(strTransaction, "REFNUM").trim()
  }

  return transaction
}

function isValidTransaction(transaction){

    if(transaction.reference_code == ""){
      return false
    }

    if(transaction.amount == ""){
      return false
    }

    if(transaction.payee == ""){
      return false
    }

    return true
}

const parseOFXfile = function(filename, callback){
  const fs = require('fs');
  const path = require('path')
  const filepath = path.resolve(__dirname, '../src/data/suntrust_export.ofx')

  fs.readFile(filepath, 'utf-8', (err, data) => {
      if(err){
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

          if(isValidTransaction(newTransaction)){

            const promise = new Promise(function(resolve, reject) {
              payee.findPayeeId(newTransaction.payee, function(payeeId){
                newTransaction.payee_id = payeeId
                resolve(newTransaction)
              })
            });
            promises.push(promise)
          }
      }

       Promise.all(promises).then(function(transactions){
          callback(transactions)
       })
  })
}

module.exports = {
  parseOFXfile: parseOFXfile
}
