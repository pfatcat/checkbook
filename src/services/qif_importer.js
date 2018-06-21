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
        //console.dir(transactions)
  
        let parsedTransactions = []
        for(let i=0; i< arr_str_transactions.length; i++){
  
          let transaction_elements = arr_str_transactions[i].split(/\r?\n/)
          //console.dir(arr_transaction)
          let parsedTransaction = {}

          for(let i=0; i< transaction_elements.length; i++){

                let transaction_element = transaction_elements[i]
                //console.dir(transaction_element)
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

         parsedTransactions.push(parsedTransaction)
        }
  
        console.dir(parsedTransactions)
    })

}

module.exports = {
    importQIFfile: importQIFfile
  }

function parseDate(strDate){
    return strDate.replace("D","").replace("'", "/").replace(" ", "")
}

/*
    const params = [newTransaction.id,
                    newTransaction.transaction_date,
                    newTransaction.payee_id,
                    newTransaction.memo,
                    newTransaction.amount,
                    newTransaction.reference_code,
                    newTransaction.payee_id]
                    */