import payee_service from "../services/payee.js"
import category_service from "../services/category.js"

const importQIFfile = function(filename){

    const fs = require('fs');
    const path = require('path')
    const filepath = path.resolve(__dirname, filename)

    fs.readFile(filepath, 'utf-8', (err, data) => {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
  
        let all_transactions = data.substring(data.indexOf("D") - 1, data.length)
        const arr_str_transactions = all_transactions.split("^")
  
        let parseTransactionPromises = []
        for(let i=0; i< arr_str_transactions.length; i++){
  
          let transaction_elements = arr_str_transactions[i].split(/\r?\n/)
          let parsedTransaction = {}

          for(let i=0; i< transaction_elements.length; i++){

                let transaction_element = transaction_elements[i]
              
                switch(transaction_element.substring(0,1)) {
                    case "D":
                        parsedTransaction.transaction_date = parseDate(transaction_element)
                        break;
                    case "U":
                        parsedTransaction.amount = transaction_element.replace("U","")
                        break;
                    case "P":
                        parsedTransaction.payee_name = transaction_element.replace("P","")
                        break;
                    case "L":
                        parsedTransaction.category_name = transaction_element.replace("L","")
                        break;
                    case "M":
                        parsedTransaction.memo = transaction_element.replace("M","")
                        break;
                    default:
                        break;
                }
          }

            if(parsedTransaction){
                parseTransactionPromises.push(populateTransactionPromise(parsedTransaction))
            }  
        }

        console.dir(parseTransactionPromises)

        Promise.all(parseTransactionPromises).then(function(transactions){
            console.dir(transactions)
         })
    })

}

module.exports = {
    importQIFfile: importQIFfile
  }

function parseDate(strDate){
    return strDate.replace("D","").replace("'", "/").replace(" ", "")
}

function populateTransactionPromise(parsedTransaction){
    return new Promise(function(resolve, reject) {
        category_service.findOrCreateCategory(parsedTransaction.category_name, function(category){
            parsedTransaction.category_id = category.id
                payee_service.findOrCreatePayee(parsedTransaction.payee_name, category.id, function(payee){
                    parsedTransaction.payee_id = payee.id
                    resolve(parsedTransaction)
                })
        })
    })
}
