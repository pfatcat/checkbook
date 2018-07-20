const buildPayeeOptions = function(payees, payee_id){

    let options = "<option value='-1'>Use source payee...</option>"

    for (let i = 0, len = payees.length; i < len; i++) {
      const payee = payees[i]

      const selected = payee.id == payee_id ? "selected" : ""

      const option = "<option value='"+ payee.id +"'" + selected + ">" + payee.name + "</option>"
      options += option
    }

    return options
  }


module.exports = {

    render_transaction_mapping: function(payees, categories, transactions){

        let map_import = document.querySelector("#map_import")
        map_import.style.display = "inline"
  
        let html = `<div id="ofx_transactions" data-transactions='${JSON.stringify(transactions)}'></div>
                    <div class="mappingHeader">
                      <div class="sourcePayee">Source Payee</div>
                      <div class="targetPayee">Target Payee</div>
                    </div>`
  
        let distinctPayees = []
  
        for (let i = 0, len = transactions.length; i < len; i++) {
  
            const transaction = transactions[i]
  
            if(distinctPayees.indexOf(transaction.payee_name) > 0){
              continue;
            }
  
            distinctPayees.push(transaction.payee_name)
  
            const row = `<div class="mapping" data-reference_code="${transaction.reference_code}">
                            <div class="sourcePayee">${transaction.payee_name}</div>
                            <div class="targetPayee"><select class="ddlPayee">${buildPayeeOptions(payees, transaction.payee_id)} </select></div>
                            <div class="newPayee"><a id="newPayee${i}" href="#" class="lnk_newPayee">New Payee</a></div>
                          </div>`
            html += row
        }
  
        document.querySelector("#transactionMapping").innerHTML = html;
    }
}