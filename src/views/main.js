import utilities from "../helpers/utilities.js"

module.exports = {

  render_transactions: function(transactions){
    let html = "";

    for (let i = 0, len = transactions.length; i < len; i++) {

      const transaction = transactions[i];

      const transaction_date = utilities.toMMDDYYYY(new Date(transaction.transaction_date))

      let record = `<div class="record">
          <div id="transaction_date">${transaction_date}</div>
          <div id="payee_category_memo">
            <div id="payee_name" >${transaction.payee_name}</div>
            <div id="category_memo">
              <div id="category_name">${transaction.category_name}</div>
              <div id="memo">${utilities.nullToSpace(transaction.memo)}</div>
            </div>
          </div>
          <div id="amount">${formatCurrency(transaction.amount)}</div>
        </div>`;

      html += record
    }

    document.querySelector("#transactions").innerHTML = html;
  },
  buildCategoryOptions: function(categories){

    let options = "<option value=''>Select a category...</option>"

    for (let i = 0, len = categories.length; i < len; i++) {
      const category = categories[i]

      const option = "<option value='"+ category.id +"'>" + category.name + "</option>"
      options += option
    }

    return options
  }
};


function formatCurrency(amount){

  return parseFloat(amount).toFixed(2)
}

